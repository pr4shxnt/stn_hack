import { AnchorProvider, Program, web3, BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { useMemo } from "react";
import idl from "./idl.json";

const PROGRAM_ID = new PublicKey(idl.address);

export function useAnchorProgram() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const program = useMemo(() => {
    // Create a provider. If no wallet, use a dummy one for read-only access
    const provider = new AnchorProvider(
      connection,
      wallet || ({} as any),
      AnchorProvider.defaultOptions(),
    );

    return new Program(idl as any, provider);
  }, [connection, wallet]);

  return program;
}

export async function createForumOnChain(
  program: Program,
  wallet: any,
): Promise<string> {
  const forumKeypair = web3.Keypair.generate();
  const date = Math.floor(Date.now() / 86400000); // Days since epoch
  const dateBn = new BN(date);

  const [dailyLimitPda] = web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("limit"),
      wallet.publicKey.toBuffer(),
      dateBn.toArrayLike(Buffer, "le", 8),
    ],
    program.programId,
  );

  await program.methods
    .createForum(dateBn)
    .accounts({
      forum: forumKeypair.publicKey,
      dailyLimit: dailyLimitPda,
      creator: wallet.publicKey,
      systemProgram: web3.SystemProgram.programId,
    })
    .signers([forumKeypair])
    .rpc();

  return forumKeypair.publicKey.toBase58();
}

export async function voteOnChain(
  program: Program,
  wallet: any,
  forumPubkey: web3.PublicKey,
  voteType: 1 | -1,
): Promise<void> {
  const [votePda] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from("vote"), forumPubkey.toBuffer(), wallet.publicKey.toBuffer()],
    program.programId,
  );

  await program.methods
    .vote(voteType)
    .accounts({
      voteAccount: votePda,
      forum: forumPubkey,
      voter: wallet.publicKey,
      systemProgram: web3.SystemProgram.programId,
    })
    .rpc();
}
