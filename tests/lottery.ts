import * as anchor from '@project-serum/anchor';
import { Lottery } from '../target/types/lottery';
import { SystemProgram } from '@solana/web3.js';
import { assert } from "chai";

describe('lottery', () => {

  // Configure the client to use the local cluster.
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Lottery as anchor.Program<Lottery>;

  it("Init Lottery contract", async () => {

    const lottery_acc = anchor.web3.Keypair.generate();
    // console.log(await provider.connection.getBalance(lottery_acc.publicKey));
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(lottery_acc.publicKey, 1_000_000_000),
      "confirmed"
    );
    console.log(await provider.connection.getBalance(lottery_acc.publicKey));
    await program.rpc.initialize(new anchor.BN(10_000), {
      accounts: {
        lotteryAccount: lottery_acc.publicKey,
        owner: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [lottery_acc],
    });
    // Fetch the newly created account from the cluster.
    const account = await program.account.lotteryAccount.fetch(lottery_acc.publicKey);
    // Check it's state was initialized.
    assert.ok(account.minimalDepositAmount.eq(new anchor.BN(10_000)));
    console.log(await provider.connection.getBalance(lottery_acc.publicKey));
  });
});