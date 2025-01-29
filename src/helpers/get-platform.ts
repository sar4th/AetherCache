import os from "os"
import { platform } from 'node:process';
import path from 'node:path';
let basePath = ""
export function getHostOSbasePath(){
    switch (platform) {
        case "linux":
            basePath = path.join(os.homedir(), ".local", "share", "microDB");
            break;
        case "win32":
            basePath = path.join(os.homedir(), "AppData", "Roaming", "microDB");
            break;
        case "darwin":
            basePath = path.join(os.homedir(), "Library", "Application Support", "microDB");
            break
        default:
          basePath= os.homedir() 
            break;
           
    }
    return basePath
}
