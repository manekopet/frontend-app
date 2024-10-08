import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { AccountMeta, PublicKey, Signer, TransactionInstruction } from '@solana/web3.js';
import BN from 'bn.js';

const BufferLayout = require('buffer-layout');

export function addSigners(keys: AccountMeta[], ownerOrAuthority: PublicKey, multiSigners: Signer[]): AccountMeta[] {
    if (multiSigners.length) {
        keys.push({ pubkey: ownerOrAuthority, isSigner: false, isWritable: false });
        for (const signer of multiSigners) {
            keys.push({ pubkey: signer.publicKey, isSigner: true, isWritable: false });
        }
    } else {
        keys.push({ pubkey: ownerOrAuthority, isSigner: true, isWritable: false });
    }
    return keys;
}

class TokenAmount extends BN {
    /**
     * Convert to Buffer representation
     */
    toBuffer(): Buffer {
        const a = super.toArray().reverse();
        const b = Buffer.from(a);
        if (b.length === 8) {
            return b;
        }

        if (b.length >= 8) {
            throw new Error('TokenAmount too large');
        }

        const zeroPad = Buffer.alloc(8);
        b.copy(zeroPad);
        return zeroPad;
    }

    /**
     * Construct a TokenAmount from Buffer representation
     */
    static fromBuffer(buffer: Buffer): TokenAmount {
        if (buffer.length !== 8) {
            throw new Error(`Invalid buffer length: ${buffer.length}`);
        }

        return new BN(
            [...buffer]
                .reverse()
                .map((i) => `00${i.toString(16)}`.slice(-2))
                .join(''),
            16,
        );
    }
}

export enum TokenInstruction {
    InitializeMint = 0,
    InitializeAccount = 1,
    InitializeMultisig = 2,
    Transfer = 3,
    Approve = 4,
    Revoke = 5,
    SetAuthority = 6,
    MintTo = 7,
    Burn = 8,
    CloseAccount = 9,
    FreezeAccount = 10,
    ThawAccount = 11,
    TransferChecked = 12,
    ApproveChecked = 13,
    MintToChecked = 14,
    BurnChecked = 15,
    InitializeAccount2 = 16,
    SyncNative = 17,
    InitializeAccount3 = 18,
    InitializeMultisig2 = 19,
    InitializeMint2 = 20,
}

export function createTransferInstruction(
    source: PublicKey,
    destination: PublicKey,
    owner: PublicKey,
    amount: number,
    multiSigners: Signer[] = [],
    programId = TOKEN_PROGRAM_ID,
): TransactionInstruction {
    const dataLayout = BufferLayout.struct([BufferLayout.u8('instruction'), BufferLayout.blob(8, 'amount')]);

    const keys = addSigners(
        [
            { pubkey: source, isSigner: false, isWritable: true },
            { pubkey: destination, isSigner: false, isWritable: true },
        ],
        owner,
        multiSigners,
    );

    const data = Buffer.alloc(dataLayout.span);
    dataLayout.encode(
        {
            instruction: TokenInstruction.Transfer,
            amount: new TokenAmount(amount).toBuffer(),
        },
        data,
    );

    return new TransactionInstruction({ keys, programId, data });
}
