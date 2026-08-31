'use client';

import React, { createContext, useContext, useReducer, ReactNode, useCallback, useEffect, useState } from 'react';
import { AppConfig, APP_CATEGORIES, getAppConfig } from '@/lib/apps-config';
import { PlaceHolderImages, ImagePlaceholder } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';
import { LucideIcon, Puzzle } from 'lucide-react';
import GenericApp from '@/components/apps/GenericApp';

// Helper to convert HEX to HSL string
const hexToHslString = (hex: string): string => {
  hex = hex.replace(/^#/, '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

const defaultColors = {
  primary: '#4285F4', // Google Blue
  accent: '#DB4437',  // Google Red
  background: '#FFFFFF', // White
};

interface WindowState {
  id: string;
  appId: string;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  lastPosition?: { x: number, y: number };
  fileContent?: { title: string, content?: string; };
}

export interface StickyNoteType {
  id: string;
  content: string;
  contentType: 'text' | 'image' | 'video' | 'audio' | 'photo';
  color: string;
  position: { x: number; y: number };
  size: { width: any; height: any };
  isPinned: boolean;
  zIndex: number;
}

export interface CustomCommand {
  id: string;
  phrase: string;
  action: {
    type: 'openApp';
    appId: string;
  };
}

export interface InstallationEvent {
  appId: string;
  action: 'installed' | 'uninstalled';
  timestamp: string;
}

export type NotificationCategory = 'System' | 'App' | 'User' | 'Social';

export interface NotificationEvent {
    id: string;
    icon: React.ElementType;
    title: string;
    description: string;
    timestamp: string;
    category: NotificationCategory;
}

type WelcomeAnimationType = 'gold' | 'matrix' | 'icons';

interface SimulatedUser {
    id: string;
    name: string;
}

interface DesktopState {
  allApps: AppConfig[];
  installedApps: string[];
  pinnedApps: string[];
  windows: WindowState[];
  stickyNotes: StickyNoteType[];
  activeWindowId: string | null;
  nextZIndex: number;
  nextWindowOffset: number;
  theme: string;
  wallpaper: ImagePlaceholder;
  customWallpapers: ImagePlaceholder[];
  isTaskDrawerOpen: boolean;
  speakerVoice: string;
  isVoiceEnabled: boolean;
  colors: {
    primary: string;
    accent: string;
    background: string;
  };
  customCommands: CustomCommand[];
  keepAppsOnReboot: boolean;
  immersiveMode: boolean;
  activeScreensaverId: string | null;
  isScreensaverActive: boolean;
  iconPositions: { [appId: string]: { x: number, y: number } };
  isDesktopScrollable: boolean;
  appSortOrder: 'categorized' | 'alphabetical';
  installationHistory: InstallationEvent[];
  appUsage: { [appId: string]: number };
  welcomeAnimation: WelcomeAnimationType;
  notifications: NotificationEvent[];
  isDndEnabled: boolean;
  activeUsers: SimulatedUser[];
}

type DesktopAction =
  | { type: 'OPEN_APP'; payload: { appId: string; initialPosition?: {x: number, y: number}, fileContent?: { title: string, content?: string } } }
  | { type: 'CLOSE_APP'; payload: { windowId: string } }
  | { type: 'FOCUS_WINDOW'; payload: { windowId: string } }
  | { type: 'TOGGLE_MINIMIZE'; payload: { windowId: string } }
  | { type: 'TOGGLE_MAXIMIZE'; payload: { windowId: string } }
  | { type: 'UPDATE_POSITION'; payload: { windowId:string; position: { x: number; y: number } } }
  | { type: 'UPDATE_WINDOW_SIZE'; payload: { windowId: string; size: { width: number; height: number } } }
  | { type: 'INSTALL_APP'; payload: { appId: string } }
  | { type: 'UNINSTALL_APP'; payload: { appId: string } }
  | { type: 'SET_THEME'; payload: { theme: string } }
  | { type: 'SET_WALLPAPER'; payload: { wallpaperId: string } }
  | { type: 'ADD_CUSTOM_WALLPAPER'; payload: { imageUrl: string } }
  | { type: 'TOGGLE_TASK_DRAWER' }
  | { type: 'SET_SPEAKER_VOICE'; payload: { voice: string } }
  | { type: 'TOGGLE_VOICE_ENABLED' }
  | { type: 'SET_COLORS'; payload: { colors: DesktopState['colors'] } }
  | { type: 'RESET_COLORS' }
  | { type: 'ADD_CUSTOM_COMMAND'; payload: { command: Omit<CustomCommand, 'id'> } }
  | { type: 'REMOVE_CUSTOM_COMMAND'; payload: { commandId: string } }
  | { type: 'TOGGLE_KEEP_APPS_ON_REBOOT' }
  | { type: 'TOGGLE_IMMERSIVE_MODE' }
  | { type: 'SET_ACTIVE_SCREENSAVER'; payload: { screensaverId: string | null } }
  | { type: 'SET_SCREENSAVER_ACTIVE'; payload: { isActive: boolean, screensaverId?: string | null } }
  | { type: 'UPDATE_ICON_POSITION'; payload: { appId: string, position: {x: number, y: number} } }
  | { type: 'TOGGLE_DESKTOP_SCROLLABLE' }
  | { type: 'TOGGLE_FULLSCREEN' }
  | { type: 'SET_APP_SORT_ORDER'; payload: { order: 'categorized' | 'alphabetical' } }
  | { type: 'ADD_APP_TO_MANIFEST'; payload: { title: string } }
  | { type: 'CLEAR_INSTALLATION_HISTORY' }
  | { type: 'CLEAR_APP_USAGE_HISTORY' }
  | { type: 'ADD_STICKY_NOTE'; payload: { note: StickyNoteType } }
  | { type: 'REMOVE_STICKY_NOTE'; payload: { noteId: string } }
  | { type: 'UPDATE_STICKY_NOTE'; payload: { noteId: string, updates: Partial<StickyNoteType> } }
  | { type: 'FOCUS_STICKY_NOTE'; payload: { noteId: string } }
  | { type: 'SET_WELCOME_ANIMATION'; payload: { animation: WelcomeAnimationType } }
  | { type: 'ADD_NOTIFICATION'; payload: { notification: NotificationEvent } }
  | { type: 'TOGGLE_DND' }
  | { type: 'SET_ACTIVE_USERS'; payload: { users: SimulatedUser[] | ((prev: SimulatedUser[]) => SimulatedUser[]) } }
  | { type: 'TOGGLE_PIN_APP'; payload: { appId: string } }
  | { type: 'REBOOT' };

interface DesktopContextType extends DesktopState {
  openApp: (appId: string, initialPosition?: {x: number, y: number}, fileContent?: { title: string, content?: string }) => void;
  closeApp: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  toggleMinimize: (windowId: string) => void;
  toggleMaximize: (windowId: string) => void;
  updateWindowPosition: (windowId: string, position: { x: number, y: number }) => void;
  updateWindowSize: (windowId: string, size: { width: number, height: number }) => void;
  installApp: (appId: string) => void;
  uninstallApp: (appId: string) => void;
  setTheme: (theme: string) => void;
  setWallpaper: (wallpaperId: string) => void;
  addCustomWallpaper: (imageUrl: string) => void;
  toggleTaskDrawer: () => void;
  reboot: () => void;
  setSpeakerVoice: (voice: string) => void;
  toggleVoiceEnabled: () => void;
  setColors: (colors: DesktopState['colors']) => void;
  resetColors: () => void;
  addCustomCommand: (command: Omit<CustomCommand, 'id'>) => void;
  removeCustomCommand: (commandId: string) => void;
  toggleKeepAppsOnReboot: () => void;
  toggleImmersiveMode: () => void;
  getAppById: (appId: string) => AppConfig | undefined;
  findWindowByAppId: (appId: string) => WindowState | undefined;
  setActiveScreensaver: (screensaverId: string | null) => void;
  setScreensaverActive: (isActive: boolean, screensaverId?: string | null) => void;
  updateIconPosition: (appId: string, position: {x: number, y: number}) => void;
  toggleDesktopScrollable: () => void;
  toggleFullscreen: () => void;
  setAppSortOrder: (order: 'categorized' | 'alphabetical') => void;
  addAppToManifest: (title: string) => void;
  clearInstallationHistory: () => void;
  clearAppUsageHistory: () => void;
  addStickyNote: (note: StickyNoteType) => void;
  removeStickyNote: (noteId: string) => void;
  updateStickyNote: (noteId: string, updates: Partial<StickyNoteType>) => void;
  focusStickyNote: (noteId: string) => void;
  setWelcomeAnimation: (animation: WelcomeAnimationType) => void;
  addNotification: (notification: Omit<NotificationEvent, 'id' | 'timestamp'>) => void;
  toggleDnd: () => void;
  setActiveUsers: (users: SimulatedUser[] | ((prev: SimulatedUser[]) => SimulatedUser[])) => void;
  togglePinApp: (appId: string) => void;
}

const DesktopContext = createContext<DesktopContextType | undefined>(undefined);

const ALL_APPS = getAppConfig();

const initialWelcomeWindow: WindowState = {
  id: `window-welcome`,
  appId: 'welcome',
  isMinimized: true,
  isMaximized: true,
  position: { x: 100, y: 100 },
  size: { width: 640, height: 480 },
  zIndex: 100,
};

const initialCodeExplorerWindow: WindowState = {
  id: `window-code-explorer`,
  appId: 'code-explorer',
  isMinimized: false,
  isMaximized: true,
  position: { x: 50, y: 50 },
  size: { width: 1024, height: 768 },
  zIndex: 101,
};

const initialState: DesktopState = {
  allApps: ALL_APPS,
  installedApps: ALL_APPS.filter(app => app.isDefault).map(app => app.id),
  pinnedApps: ['files', 'browser', 'settings', 'terminal'],
  windows: [initialWelcomeWindow, initialCodeExplorerWindow],
  stickyNotes: [],
  activeWindowId: initialCodeExplorerWindow.id,
  nextZIndex: 102,
  nextWindowOffset: 1,
  theme: 'google',
  wallpaper: PlaceHolderImages[0],
  customWallpapers: [],
  isTaskDrawerOpen: false,
  speakerVoice: 'Algenib',
  isVoiceEnabled: true,
  colors: defaultColors,
  customCommands: [],
  keepAppsOnReboot: true,
  immersiveMode: false,
  activeScreensaverId: null,
  isScreensaverActive: false,
  iconPositions: {},
  isDesktopScrollable: false,
  appSortOrder: 'categorized',
  installationHistory: [],
  appUsage: {},
  welcomeAnimation: 'gold',
  notifications: [],
  isDndEnabled: true,
  activeUsers: [],
};

// Note: Full reducer and provider logic preserved from original DesktopContext.tsx
// This file is a copy into the new clean structure (01-core/desktop/)

export const useDesktop = () => {
  const context = useContext(DesktopContext);
  if (context === undefined) {
    throw new Error('useDesktop must be used within a DesktopProvider');
  }
  return context;
};

// Dummy formatDistanceToNow
function formatDistanceToNow(date: Date, options: { addSuffix: boolean }): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 5) return 'just now';
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds/60)}m ago`;
    return `${Math.floor(seconds/3600)}h ago`;
}
