import { autoUpdater } from 'electron-updater';
import { ipcMain, ipcRenderer, BrowserWindow } from 'electron';

let windowInstance: BrowserWindow | null = null;

export const updateHandle = (mainWindow: BrowserWindow) => {
  if (windowInstance) {
    return windowInstance;
  }
  windowInstance = mainWindow;
  const config = require('../../package.json');
  const message: AnyObject = {
    error: '检查更新出错',
    checking: '正在检查更新',
    updateAva: '检测到新版本',
    updateDownloaded: '已下载最新版本',
    updateNotAva: '现在使用的就是最新版本，不用更新',
  };
  // 通过main进程发送事件给renderer进程，提示更新信息
  const sendUpdateMessage = (state: string, info: AnyObject, ...rest: any[]) => {
    mainWindow.webContents.send('message', state, message[state], info);
  };
  Object.assign(autoUpdater, {
    autoDownload: false,
    currentVersion: config.version,
  });

  autoUpdater.setFeedURL(config.build.publish[0]);

  autoUpdater.on('error', (event, error: Error) => {
    sendUpdateMessage('error', event, error);
  });
  autoUpdater.on('checking-for-update', (info) => {
    sendUpdateMessage('checking', info);
  });
  autoUpdater.on('update-available', (info) => {
    sendUpdateMessage('updateAva', info);
  });
  autoUpdater.on('update-not-available', (info) => {
    sendUpdateMessage('updateNotAva', info);
  });
  autoUpdater.on('isUpdateAvailable', (info) => {
    sendUpdateMessage('isUpdateAvailable', info);
  });
  // 更新下载进度事件
  autoUpdater.on('download-progress', (progressObj) => {
    mainWindow.webContents.send('downloadProgress', progressObj);
  });
  /**
   * Auto Updater
   *
   * Uncomment the following code below and install `electron-updater` to
   * support auto updating. Code Signing with a valid certificate is required.
   * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
   */
  autoUpdater.on('update-downloaded', (info) => {
    sendUpdateMessage('updateDownloaded', info);
  });

  // 由用户来触发的行为
  // 检查版本更新
  ipcMain.on('checkForUpdate', () => {
    autoUpdater.checkForUpdates();
  });
  // 开始更新
  ipcMain.on('updateNow', (event, arg) => {
    autoUpdater.quitAndInstall();
  });
  // 下载最新版本
  ipcMain.on('download-new-update', (event, arg) => {
    autoUpdater.downloadUpdate();
  });
  return mainWindow;
};
export default {
  updateHandle,
};
