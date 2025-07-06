import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';
import NetInfo from '@react-native-community/netinfo';

interface OfflineContextType {
  isOnline: boolean;
  syncData: () => Promise<void>;
  saveOfflineData: (key: string, data: any) => Promise<void>;
  getOfflineData: (key: string) => Promise<any>;
  pendingActions: any[];
  addPendingAction: (action: any) => void;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingActions, setPendingActions] = useState<any[]>([]);
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

  useEffect(() => {
    initializeDatabase();
    setupNetworkListener();
    loadPendingActions();
  }, []);

  const initializeDatabase = async () => {
    const database = SQLite.openDatabase('muse_offline.db');
    setDb(database);

    // Create tables for offline data
    database.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS offline_posts (
          id TEXT PRIMARY KEY,
          data TEXT,
          created_at INTEGER
        )`
      );
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS offline_artists (
          id TEXT PRIMARY KEY,
          data TEXT,
          updated_at INTEGER
        )`
      );
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS pending_actions (
          id TEXT PRIMARY KEY,
          action TEXT,
          data TEXT,
          created_at INTEGER
        )`
      );
    });
  };

  const setupNetworkListener = () => {
    NetInfo.addEventListener(state => {
      const wasOffline = !isOnline;
      const isNowOnline = state.isConnected && state.isInternetReachable;
      
      setIsOnline(isNowOnline);

      // Sync data when coming back online
      if (wasOffline && isNowOnline) {
        syncData();
      }
    });
  };

  const loadPendingActions = async () => {
    if (!db) return;

    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM pending_actions ORDER BY created_at ASC',
        [],
        (_, { rows }) => {
          setPendingActions(rows._array);
        }
      );
    });
  };

  const syncData = async () => {
    if (!isOnline || !db) return;

    try {
      // Process pending actions
      for (const action of pendingActions) {
        await processPendingAction(action);
      }

      // Sync offline posts
      await syncOfflinePosts();

      // Sync offline artist data
      await syncOfflineArtists();

      // Clear pending actions after successful sync
      setPendingActions([]);
      db.transaction(tx => {
        tx.executeSql('DELETE FROM pending_actions');
      });

    } catch (error) {
      console.error('Sync failed:', error);
    }
  };

  const processPendingAction = async (action: any) => {
    const actionData = JSON.parse(action.data);
    
    try {
      switch (action.action) {
        case 'CREATE_POST':
          await createPost(actionData);
          break;
        case 'UPDATE_PROFILE':
          await updateProfile(actionData);
          break;
        case 'BOOK_ARTIST':
          await bookArtist(actionData);
          break;
        case 'SUPPORT_CAMPAIGN':
          await supportCampaign(actionData);
          break;
        default:
          console.warn('Unknown action type:', action.action);
      }
    } catch (error) {
      console.error(`Failed to process action ${action.action}:`, error);
    }
  };

  const saveOfflineData = async (key: string, data: any) => {
    if (!db) return;

    const timestamp = Date.now();
    const dataString = JSON.stringify(data);

    db.transaction(tx => {
      tx.executeSql(
        'INSERT OR REPLACE INTO offline_posts (id, data, created_at) VALUES (?, ?, ?)',
        [key, dataString, timestamp]
      );
    });
  };

  const getOfflineData = async (key: string) => {
    if (!db) return null;

    return new Promise((resolve) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT data FROM offline_posts WHERE id = ?',
          [key],
          (_, { rows }) => {
            if (rows.length > 0) {
              resolve(JSON.parse(rows.item(0).data));
            } else {
              resolve(null);
            }
          }
        );
      });
    });
  };

  const addPendingAction = (action: any) => {
    if (!db) return;

    const actionId = `${action.type}_${Date.now()}`;
    const actionData = JSON.stringify(action);
    const timestamp = Date.now();

    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO pending_actions (id, action, data, created_at) VALUES (?, ?, ?, ?)',
        [actionId, action.type, actionData, timestamp]
      );
    });

    setPendingActions(prev => [...prev, { id: actionId, action: action.type, data: actionData, created_at: timestamp }]);
  };

  // Mock API functions (replace with actual API calls)
  const createPost = async (data: any) => {
    // API call to create post
    console.log('Creating post:', data);
  };

  const updateProfile = async (data: any) => {
    // API call to update profile
    console.log('Updating profile:', data);
  };

  const bookArtist = async (data: any) => {
    // API call to book artist
    console.log('Booking artist:', data);
  };

  const supportCampaign = async (data: any) => {
    // API call to support campaign
    console.log('Supporting campaign:', data);
  };

  const syncOfflinePosts = async () => {
    // Sync offline posts with server
    console.log('Syncing offline posts');
  };

  const syncOfflineArtists = async () => {
    // Sync offline artist data with server
    console.log('Syncing offline artists');
  };

  return (
    <OfflineContext.Provider
      value={{
        isOnline,
        syncData,
        saveOfflineData,
        getOfflineData,
        pendingActions,
        addPendingAction,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  const context = useContext(OfflineContext);
  if (context === undefined) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
} 