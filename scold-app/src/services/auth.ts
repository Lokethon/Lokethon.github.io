import { storage } from '../utils/storage';
import { generateId } from '../utils/helpers';
import type { User } from '@/types/user';

const USERS_KEY = '@scold_users_db';
const SESSION_KEY = '@scold_session';

type AuthListener = (user: User | null) => void;

interface StoredAuthUser {
  user: User;
  passwordHash: string;
}

// Simple insecure hashing for local storage only
const hashPassword = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36) + 'salty';
};

class AuthService {
  private listeners: Set<AuthListener> = new Set();
  private currentUser: User | null = null;

  onAuthStateChanged(listener: AuthListener): () => void {
    this.listeners.add(listener);
    listener(this.currentUser); // immediate invoke with current state
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentUser));
  }

  async getCurrentUser(): Promise<User | null> {
    const session = await storage.getItem<User>(SESSION_KEY);
    this.currentUser = session;
    return session;
  }

  private async getUsersDb(): Promise<Record<string, StoredAuthUser>> {
    return await storage.getItem<Record<string, StoredAuthUser>>(USERS_KEY) || {};
  }

  private async saveUsersDb(db: Record<string, StoredAuthUser>): Promise<void> {
    await storage.setItem(USERS_KEY, db);
  }

  async signUp(email: string, password: string, displayName: string): Promise<User> {
    const normalizedEmail = email.toLowerCase().trim();
    if (!normalizedEmail || !password || !displayName) {
      throw new Error('All fields are required');
    }

    const db = await this.getUsersDb();
    if (db[normalizedEmail]) {
      throw new Error('User already exists with this email');
    }

    const newUser: User = {
      id: generateId(),
      email: normalizedEmail,
      displayName,
      createdAt: Date.now(),
    };

    db[normalizedEmail] = {
      user: newUser,
      passwordHash: hashPassword(password),
    };

    await this.saveUsersDb(db);
    
    // Set session
    await storage.setItem(SESSION_KEY, newUser);
    this.currentUser = newUser;
    this.notifyListeners();

    return newUser;
  }

  async signIn(email: string, password: string): Promise<User> {
    const normalizedEmail = email.toLowerCase().trim();
    const db = await this.getUsersDb();
    
    const account = db[normalizedEmail];
    if (!account) {
      throw new Error('Invalid email or password');
    }

    if (account.passwordHash !== hashPassword(password)) {
      throw new Error('Invalid email or password');
    }

    // Set session
    await storage.setItem(SESSION_KEY, account.user);
    this.currentUser = account.user;
    this.notifyListeners();

    return account.user;
  }

  async signOut(): Promise<void> {
    await storage.removeItem(SESSION_KEY);
    this.currentUser = null;
    this.notifyListeners();
  }

  async updateUser(updates: User): Promise<void> {
    const db = await this.getUsersDb();
    const email = updates.email.toLowerCase().trim();
    
    if (db[email]) {
      db[email].user = updates;
      await this.saveUsersDb(db);
      
      // Update session if it's the current user
      if (this.currentUser?.id === updates.id) {
        this.currentUser = updates;
        await storage.setItem(SESSION_KEY, updates);
        this.notifyListeners();
      }
    }
  }
}

export const authService = new AuthService();
