
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
  isMinimized: true, // Start minimized
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

const desktopReducer = (state: DesktopState, action: DesktopAction): DesktopState => {
  switch (action.type) {
    case 'OPEN_APP': {
      const { appId, initialPosition, fileContent } = action.payload;
      const newAppUsage = {
        ...state.appUsage,
        [appId]: (state.appUsage[appId] || 0) + 1,
      };
      
      const existingWindow = state.windows.find(w => w.appId === appId && !fileContent);
      if (existingWindow) {
        return {
          ...state,
          windows: state.windows.map(w => w.id === existingWindow.id ? { ...w, isMinimized: false, zIndex: state.nextZIndex + 1 } : w),
          activeWindowId: existingWindow.id,
          nextZIndex: state.nextZIndex + 1,
          isTaskDrawerOpen: false,
          appUsage: newAppUsage,
        };
      }
      
      const newWindowId = `window-${Date.now()}`;
      const offset = (state.nextWindowOffset * 30) % 300;
      const newWindow: WindowState = {
        id: newWindowId,
        appId: appId,
        isMinimized: false,
        isMaximized: appId === 'files' || appId === 'matt-code',
        position: initialPosition || { x: 100 + offset, y: 100 + offset },
        size: { width: 640, height: 480 },
        zIndex: state.nextZIndex,
        fileContent: fileContent,
      };

      if (fileContent && appId === 'browser') {
        newWindow.size = { width: 800, height: 600 };
      }
      
      return {
        ...state,
        windows: [...state.windows, newWindow],
        activeWindowId: newWindowId,
        nextZIndex: state.nextZIndex + 1,
        nextWindowOffset: state.nextWindowOffset + 1,
        isTaskDrawerOpen: false,
        appUsage: newAppUsage,
      };
    }
    case 'CLOSE_APP':
      return {
        ...state,
        windows: state.windows.filter(w => w.id !== action.payload.windowId),
        activeWindowId: state.activeWindowId === action.payload.windowId ? null : state.activeWindowId,
      };
    case 'FOCUS_WINDOW':
      if (action.payload.windowId === state.activeWindowId && !state.isTaskDrawerOpen) return state;
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload.windowId ? { ...w, zIndex: state.nextZIndex, isMinimized: false } : w
        ),
        activeWindowId: action.payload.windowId,
        nextZIndex: state.nextZIndex + 1,
        isTaskDrawerOpen: false,
      };
    case 'TOGGLE_MINIMIZE':
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload.windowId ? { ...w, isMinimized: !w.isMinimized } : w
        ),
        activeWindowId: state.activeWindowId === action.payload.windowId && !state.windows.find(w=>w.id === action.payload.windowId)?.isMinimized ? null : state.activeWindowId,
      };
    case 'TOGGLE_MAXIMIZE':
        return {
            ...state,
            windows: state.windows.map(w => {
                if (w.id === action.payload.windowId) {
                    return { ...w, isMaximized: !w.isMaximized };
                }
                return w;
            })
        };
    case 'UPDATE_POSITION':
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload.windowId ? { ...w, position: action.payload.position } : w
        ),
      };
    case 'UPDATE_WINDOW_SIZE':
        return {
            ...state,
            windows: state.windows.map(w =>
                w.id === action.payload.windowId ? { ...w, size: action.payload.size } : w
            ),
        };
    case 'INSTALL_APP': {
        if (state.installedApps.includes(action.payload.appId)) return state;
        const newHistoryEvent: InstallationEvent = {
            appId: action.payload.appId,
            action: 'installed',
            timestamp: new Date().toISOString(),
        };
        return {
            ...state,
            installedApps: [...state.installedApps, action.payload.appId],
            installationHistory: [newHistoryEvent, ...state.installationHistory],
        };
    }
    case 'UNINSTALL_APP': {
        if (!state.installedApps.includes(action.payload.appId)) return state;
        const newHistoryEvent: InstallationEvent = {
            appId: action.payload.appId,
            action: 'uninstalled',
            timestamp: new Date().toISOString(),
        };
        return {
            ...state,
            installedApps: state.installedApps.filter(id => id !== action.payload.appId),
            pinnedApps: state.pinnedApps.filter(id => id !== action.payload.appId),
            windows: state.windows.filter(w => w.appId !== action.payload.appId),
            installationHistory: [newHistoryEvent, ...state.installationHistory],
        };
    }
    case 'CLEAR_INSTALLATION_HISTORY':
        return { ...state, installationHistory: [] };
    case 'CLEAR_APP_USAGE_HISTORY':
        return { ...state, appUsage: {} };
    case 'SET_THEME':
      return { ...state, theme: action.payload.theme };
    case 'SET_COLORS':
      return { ...state, colors: action.payload.colors };
    case 'RESET_COLORS':
      return { ...state, colors: defaultColors };
    case 'SET_SPEAKER_VOICE':
      return { ...state, speakerVoice: action.payload.voice };
    case 'TOGGLE_VOICE_ENABLED':
      return { ...state, isVoiceEnabled: !state.isVoiceEnabled };
    case 'SET_WALLPAPER':
      const allWallpapers = [...PlaceHolderImages, ...state.customWallpapers];
      const newWallpaper = allWallpapers.find(img => img.id === action.payload.wallpaperId);
      return newWallpaper ? { ...state, wallpaper: newWallpaper } : state;
    case 'ADD_CUSTOM_WALLPAPER': {
      const newWallpaper: ImagePlaceholder = {
        id: `custom-${Date.now()}`,
        description: 'Custom wallpaper',
        imageUrl: action.payload.imageUrl,
        imageHint: 'custom wallpaper'
      };
      return {
        ...state,
        customWallpapers: [...state.customWallpapers, newWallpaper],
      };
    }
    case 'TOGGLE_TASK_DRAWER':
      return { ...state, isTaskDrawerOpen: !state.isTaskDrawerOpen };
    case 'ADD_CUSTOM_COMMAND':
      const newCommand: CustomCommand = { ...action.payload.command, id: `cmd-${Date.now()}`};
      return {
        ...state,
        customCommands: [...state.customCommands, newCommand]
      };
    case 'REMOVE_CUSTOM_COMMAND':
      return {
        ...state,
        customCommands: state.customCommands.filter(cmd => cmd.id !== action.payload.commandId)
      };
    case 'TOGGLE_KEEP_APPS_ON_REBOOT':
      return { ...state, keepAppsOnReboot: !state.keepAppsOnReboot };
    case 'TOGGLE_IMMERSIVE_MODE':
      return { ...state, immersiveMode: !state.immersiveMode };
    case 'SET_ACTIVE_SCREENSAVER':
      return { ...state, activeScreensaverId: action.payload.screensaverId };
    case 'SET_SCREENSAVER_ACTIVE':
      return {
        ...state,
        isScreensaverActive: action.payload.isActive,
        activeScreensaverId: action.payload.screensaverId !== undefined ? action.payload.screensaverId : state.activeScreensaverId,
      };
    case 'UPDATE_ICON_POSITION':
        return {
            ...state,
            iconPositions: {
                ...state.iconPositions,
                [action.payload.appId]: action.payload.position,
            }
        };
    case 'TOGGLE_DESKTOP_SCROLLABLE':
        return { ...state, isDesktopScrollable: !state.isDesktopScrollable };
    case 'SET_APP_SORT_ORDER':
      return { ...state, appSortOrder: action.payload.order };
    case 'SET_WELCOME_ANIMATION':
        return { ...state, welcomeAnimation: action.payload.animation };
    case 'ADD_APP_TO_MANIFEST': {
        const newApp: AppConfig = {
            id: action.payload.title.toLowerCase().replace(/\s+/g, '-'),
            title: action.payload.title,
            icon: Puzzle, // Default icon
            category: 'Tools', // Default category
            component: GenericApp,
        };
        // Avoid adding if an app with the same ID already exists
        if (state.allApps.some(app => app.id === newApp.id)) {
            return state;
        }
        return {
            ...state,
            allApps: [...state.allApps, newApp]
        };
    }
    case 'TOGGLE_FULLSCREEN':
      if (typeof window !== 'undefined' && document) {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        }
      }
      return state;
    case 'ADD_STICKY_NOTE':
        const noteWithZIndex = { ...action.payload.note, zIndex: state.nextZIndex };
        return { 
            ...state, 
            stickyNotes: [...state.stickyNotes, noteWithZIndex],
            nextZIndex: state.nextZIndex + 1,
        };
    case 'REMOVE_STICKY_NOTE':
        return { ...state, stickyNotes: state.stickyNotes.filter(n => n.id !== action.payload.noteId) };
    case 'UPDATE_STICKY_NOTE':
        return {
            ...state,
            stickyNotes: state.stickyNotes.map(n => n.id === action.payload.noteId ? { ...n, ...action.payload.updates } : n)
        };
    case 'FOCUS_STICKY_NOTE':
        return {
            ...state,
            stickyNotes: state.stickyNotes.map(n => n.id === action.payload.noteId ? { ...n, zIndex: state.nextZIndex } : n),
            nextZIndex: state.nextZIndex + 1,
        };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload.notification, ...state.notifications].slice(0, 20), // Keep last 20
      };
    case 'TOGGLE_DND':
      return { ...state, isDndEnabled: !state.isDndEnabled };
    case 'SET_ACTIVE_USERS':
      return {
        ...state,
        activeUsers: typeof action.payload.users === 'function' 
          ? action.payload.users(state.activeUsers) 
          : action.payload.users,
      };
    case 'TOGGLE_PIN_APP': {
        const { appId } = action.payload;
        const isPinned = state.pinnedApps.includes(appId);
        return {
            ...state,
            pinnedApps: isPinned
                ? state.pinnedApps.filter(id => id !== appId)
                : [...state.pinnedApps, appId],
        };
    }
    case 'REBOOT': {
        const rebootState: DesktopState = {
            ...initialState,
            allApps: state.allApps,
            customWallpapers: state.customWallpapers,
            speakerVoice: state.speakerVoice,
            theme: state.theme,
            colors: state.colors,
            customCommands: state.customCommands,
            keepAppsOnReboot: state.keepAppsOnReboot,
            immersiveMode: state.immersiveMode,
            iconPositions: state.iconPositions,
            activeScreensaverId: state.activeScreensaverId,
            appSortOrder: state.appSortOrder,
            appUsage: state.appUsage,
            stickyNotes: state.stickyNotes.filter(n => n.isPinned),
            welcomeAnimation: state.welcomeAnimation,
            isDndEnabled: state.isDndEnabled,
            activeUsers: state.activeUsers,
        };
        if (state.keepAppsOnReboot) {
            rebootState.windows = state.windows.map(w => ({ ...w, isMinimized: false }));
            rebootState.activeWindowId = state.activeWindowId;
            rebootState.nextZIndex = state.nextZIndex;
            rebootState.nextWindowOffset = state.nextWindowOffset;
            rebootState.installedApps = state.installedApps;
            rebootState.installationHistory = state.installationHistory;
            rebootState.notifications = state.notifications;
            rebootState.pinnedApps = state.pinnedApps;
        } else {
            // If not keeping apps, reset to only the welcome window and default apps
            rebootState.windows = [initialWelcomeWindow, initialCodeExplorerWindow];
            rebootState.activeWindowId = initialCodeExplorerWindow.id;
            rebootState.installedApps = initialState.installedApps;
            rebootState.installationHistory = [];
            rebootState.notifications = [];
            rebootState.activeUsers = [];
            rebootState.pinnedApps = initialState.pinnedApps;
        }
        return rebootState;
    }
    default:
      return state;
  }
};

export const DesktopProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(desktopReducer, initialState);
  const { toast } = useToast();

  const openApp = useCallback((appId: string, initialPosition?: {x: number, y: number}, fileContent?: { title: string, content?: string }) => {
    dispatch({ type: 'OPEN_APP', payload: { appId, initialPosition, fileContent } });
  }, []);
  const closeApp = useCallback((windowId: string) => dispatch({ type: 'CLOSE_APP', payload: { windowId } }), []);
  const focusWindow = useCallback((windowId: string) => dispatch({ type: 'FOCUS_WINDOW', payload: { windowId } }), []);
  const toggleMinimize = useCallback((windowId: string) => dispatch({ type: 'TOGGLE_MINIMIZE', payload: { windowId } }), []);
  const toggleMaximize = useCallback((windowId: string) => dispatch({ type: 'TOGGLE_MAXIMIZE', payload: { windowId } }), []);
  const updateWindowPosition = useCallback((windowId: string, position: { x: number, y: number }) => dispatch({ type: 'UPDATE_POSITION', payload: { windowId, position } }), []);
  const updateWindowSize = useCallback((windowId: string, size: { width: number, height: number }) => dispatch({ type: 'UPDATE_WINDOW_SIZE', payload: { windowId, size } }), []);
  const toggleTaskDrawer = useCallback(() => dispatch({ type: 'TOGGLE_TASK_DRAWER' }), []);
  const toggleVoiceEnabled = useCallback(() => dispatch({ type: 'TOGGLE_VOICE_ENABLED' }), []);
  const toggleKeepAppsOnReboot = useCallback(() => dispatch({ type: 'TOGGLE_KEEP_APPS_ON_REBOOT' }), []);
  const toggleImmersiveMode = useCallback(() => dispatch({ type: 'TOGGLE_IMMERSIVE_MODE' }), []);
  const setActiveScreensaver = useCallback((screensaverId: string | null) => dispatch({ type: 'SET_ACTIVE_SCREENSAVER', payload: { screensaverId } }), []);
  const setScreensaverActive = useCallback((isActive: boolean, screensaverId?: string | null) => dispatch({ type: 'SET_SCREENSAVER_ACTIVE', payload: { isActive, screensaverId } }), []);
  const updateIconPosition = useCallback((appId: string, position: { x: number, y: number }) => dispatch({ type: 'UPDATE_ICON_POSITION', payload: { appId, position } }), []);
  const toggleDesktopScrollable = useCallback(() => dispatch({ type: 'TOGGLE_DESKTOP_SCROLLABLE' }), []);
  const toggleFullscreen = useCallback(() => dispatch({ type: 'TOGGLE_FULLSCREEN' }), []);
  const setAppSortOrder = useCallback((order: 'categorized' | 'alphabetical') => dispatch({ type: 'SET_APP_SORT_ORDER', payload: { order } }), []);
  const setWelcomeAnimation = useCallback((animation: WelcomeAnimationType) => dispatch({ type: 'SET_WELCOME_ANIMATION', payload: { animation } }), []);
  const addAppToManifest = useCallback((title: string) => dispatch({ type: 'ADD_APP_TO_MANIFEST', payload: { title } }), []);
  const togglePinApp = useCallback((appId: string) => dispatch({ type: 'TOGGLE_PIN_APP', payload: { appId } }), []);
  
  const clearInstallationHistory = useCallback(() => {
    dispatch({ type: 'CLEAR_INSTALLATION_HISTORY' });
    toast({ title: "Activity Cleared", description: "The application installation history has been cleared." });
  }, [toast]);
  
  const clearAppUsageHistory = useCallback(() => {
    dispatch({ type: 'CLEAR_APP_USAGE_HISTORY' });
    toast({ title: "Usage Data Cleared", description: "The application usage statistics have been cleared." });
  }, [toast]);
  
  const addNotification = useCallback((notification: Omit<NotificationEvent, 'id' | 'timestamp'>) => {
    const newNotification: NotificationEvent = {
        ...notification,
        id: `notif-${Date.now()}`,
        timestamp: formatDistanceToNow(new Date(), { addSuffix: true }),
    };

    if (!state.isDndEnabled) {
        toast({ title: newNotification.title, description: newNotification.description });
    }
    dispatch({ type: 'ADD_NOTIFICATION', payload: { notification: newNotification } });
  }, [state.isDndEnabled, toast]);

  const toggleDnd = useCallback(() => {
    const willBeEnabled = !state.isDndEnabled;
    toast({ title: `Do Not Disturb ${willBeEnabled ? 'Enabled' : 'Disabled'}` });
    dispatch({ type: 'TOGGLE_DND' });
  }, [state.isDndEnabled, toast]);

  const setActiveUsers = useCallback((users: SimulatedUser[] | ((prev: SimulatedUser[]) => SimulatedUser[])) => {
    dispatch({ type: 'SET_ACTIVE_USERS', payload: { users } });
  }, []);


  const installApp = useCallback((appId: string) => {
    dispatch({ type: 'INSTALL_APP', payload: { appId } });
    const app = state.allApps.find(a => a.id === appId);
    addNotification({
        icon: app?.icon || Puzzle,
        title: 'App Installed',
        description: `${app?.title} has been installed.`,
        category: 'App',
    });
  }, [state.allApps, addNotification]);
  
  const uninstallApp = useCallback((appId: string) => {
    dispatch({ type: 'UNINSTALL_APP', payload: { appId } });
    const app = state.allApps.find(a => a.id === appId);
     addNotification({
        icon: app?.icon || Puzzle,
        title: 'App Uninstalled',
        description: `${app?.title} has been removed.`,
        category: 'App',
    });
  }, [state.allApps, addNotification]);
  
  const reboot = useCallback(() => {
    addNotification({ icon: Puzzle, title: 'System Rebooting', description: 'The desktop is restarting...', category: 'System' });
    setTimeout(() => {
      dispatch({ type: 'REBOOT' });
    }, 1500);
  }, [addNotification]);

  const setTheme = useCallback((theme: string) => {
    dispatch({ type: 'SET_THEME', payload: { theme } });
  }, []);

  const setColors = useCallback((colors: DesktopState['colors']) => {
    dispatch({ type: 'SET_COLORS', payload: { colors } });
  }, []);
  
  const resetColors = useCallback(() => {
    dispatch({ type: 'RESET_COLORS' });
    addNotification({ icon: Puzzle, title: 'Colors Reset', description: 'The color theme has been reset to its default values.', category: 'System'});
  }, [addNotification]);

  const setSpeakerVoice = useCallback((voice: string) => {
    dispatch({ type: 'SET_SPEAKER_VOICE', payload: { voice } });
    addNotification({ icon: Puzzle, title: 'Speaker Voice Changed', description: `Voice set to ${voice}.`, category: 'System' });
  }, [addNotification]);

  const setWallpaper = useCallback((wallpaperId: string) => {
    dispatch({ type: 'SET_WALLPAPER', payload: { wallpaperId } });
    addNotification({ icon: Puzzle, title: 'Desktop Background Changed', description: '', category: 'System' });
  }, [addNotification]);
  
  const addCustomWallpaper = useCallback((imageUrl: string) => {
    dispatch({ type: 'ADD_CUSTOM_WALLPAPER', payload: { imageUrl } });
    addNotification({ icon: Puzzle, title: 'Custom Wallpaper Added', description: '', category: 'System' });
  }, [addNotification]);

  const addCustomCommand = useCallback((command: Omit<CustomCommand, 'id'>) => {
    dispatch({ type: 'ADD_CUSTOM_COMMAND', payload: { command } });
    addNotification({ icon: Puzzle, title: 'Custom Command Added', description: `You can now say "Hey Desktop, ${command.phrase}"`, category: 'System' });
  }, [addNotification]);

  const removeCustomCommand = useCallback((commandId: string) => {
    dispatch({ type: 'REMOVE_CUSTOM_COMMAND', payload: { commandId } });
    addNotification({ icon: Puzzle, title: 'Custom Command Removed', description: '', category: 'System' });
  }, [addNotification]);

  const addStickyNote = useCallback((note: StickyNoteType) => dispatch({ type: 'ADD_STICKY_NOTE', payload: { note } }), []);
  const removeStickyNote = useCallback((noteId: string) => dispatch({ type: 'REMOVE_STICKY_NOTE', payload: { noteId } }), []);
  const updateStickyNote = useCallback((noteId: string, updates: Partial<StickyNoteType>) => dispatch({ type: 'UPDATE_STICKY_NOTE', payload: { noteId, updates } }), []);
  const focusStickyNote = useCallback((noteId: string) => dispatch({ type: 'FOCUS_STICKY_NOTE', payload: { noteId } }), []);

  const getAppById = useCallback((appId: string) => state.allApps.find(app => app.id === appId), [state.allApps]);
  const findWindowByAppId = useCallback((appId: string) => state.windows.find(w => w.appId === appId), [state.windows]);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark', 'holiday', 'default', 'microsoft', 'windows', 'google', 'youtube', 'yahoo', 'chromebook');
    document.documentElement.classList.add(state.theme);
  }, [state.theme]);

  useEffect(() => {
    const styleId = 'custom-colors-style';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    
    const primaryHsl = hexToHslString(state.colors.primary);
    const accentHsl = hexToHslString(state.colors.accent);
    const backgroundHsl = hexToHslString(state.colors.background);
    
    const applyToRoot = (selector: string) => `
      ${selector} {
        --primary: ${primaryHsl};
        --accent: ${accentHsl};
        --ring: ${primaryHsl};
        ${!['holiday', 'dark'].includes(state.theme) ? `--background: ${backgroundHsl}; --card: ${backgroundHsl}; --popover: ${backgroundHsl};` : ''}
      }
    `;
    
    styleElement.innerHTML = `
      ${applyToRoot(':root')}
      ${applyToRoot('.dark')}
      ${applyToRoot('.holiday')}
    `;
  }, [state.colors, state.theme]);


  return (
    <DesktopContext.Provider value={{ 
        ...state, 
        openApp, 
        closeApp, 
        focusWindow, 
        toggleMinimize, 
        toggleMaximize, 
        updateWindowPosition, 
        updateWindowSize,
        installApp, 
        uninstallApp, 
        reboot, 
        setTheme, 
        setWallpaper, 
        addCustomWallpaper, 
        toggleTaskDrawer, 
        setSpeakerVoice, 
        toggleVoiceEnabled, 
        getAppById, 
        findWindowByAppId, 
        setColors, 
        resetColors, 
        addCustomCommand, 
        removeCustomCommand, 
        toggleKeepAppsOnReboot, 
        toggleImmersiveMode,
        setActiveScreensaver,
        setScreensaverActive,
        updateIconPosition,
        toggleDesktopScrollable,
        toggleFullscreen,
        setAppSortOrder,
        addAppToManifest,
        clearInstallationHistory,
        clearAppUsageHistory,
        addStickyNote,
        removeStickyNote,
        updateStickyNote,
        focusStickyNote,
        setWelcomeAnimation,
        addNotification,
        toggleDnd,
        setActiveUsers,
        togglePinApp,
    }}>
      {children}
    </DesktopContext.Provider>
  );
};

export const useDesktop = () => {
  const context = useContext(DesktopContext);
  if (context === undefined) {
    throw new Error('useDesktop must be used within a DesktopProvider');
  }
  return context;
};

// Dummy formatDistanceToNow to avoid importing a large library for this one-off use case.
function formatDistanceToNow(date: Date, options: { addSuffix: boolean }): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 5) return 'just now';
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds/60)}m ago`;
    return `${Math.floor(seconds/3600)}h ago`;
}
