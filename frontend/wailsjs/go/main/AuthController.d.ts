// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
import {app} from '../models';
import {main} from '../models';

export function ConfigureVault(arg1:app.Context,arg2:main.Auth_ConfigureVaultCommandInput):Promise<void>;

export function IsVaultConfigured(arg1:app.Context):Promise<boolean>;

export function LockVault():Promise<void>;

export function UnlockVault(arg1:app.Context,arg2:main.Auth_UnlockCommandInput):Promise<boolean>;
