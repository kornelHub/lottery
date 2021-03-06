import * as anchor from '@project-serum/anchor';
import { Lottery } from '../target/types/lottery';
import { SystemProgram } from '@solana/web3.js';
import { assert } from "chai";

describe('lottery', () => {

  // Configure the client to use the local cluster.
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Lottery as anchor.Program<Lottery>;
  const lottery_acc = anchor.web3.Keypair.generate();
  const lottery_participants = anchor.web3.Keypair.generate();
  const payer_lottery_participants = anchor.web3.Keypair.generate();

  it("Init Lottery contract", async () => {
    await program.rpc.initialize(new anchor.BN(10_000), {
      accounts: {
        lotteryAccount: lottery_acc.publicKey,
        owner: provider.wallet.publicKey,
        lotteryParticipants: lottery_participants.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [lottery_acc, lottery_participants],
    });
    // Fetch the newly created account from the cluster.
    const account = await program.account.lotteryAccount.fetch(lottery_acc.publicKey);
    // Check it's state was initialized.
    assert.ok(account.minimalDepositAmount.eq(new anchor.BN(10_000)));
  });
});