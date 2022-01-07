use anchor_lang::prelude::*;

declare_id!("G8NcBhBPo8gRzAn6EjkAsHi2szZw7AxUHnwm6vpPFmnv");

#[program]
pub mod lottery {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>, _minimal_deposit_amount: u64) -> ProgramResult {
        let lottery_acc = &mut ctx.accounts.lottery_account;
        
        lottery_acc.owner = *ctx.accounts.owner.key;
        lottery_acc.minimal_deposit_amount = _minimal_deposit_amount;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = owner, space = 48 + 8)]
    pub lottery_account: Account<'info, LotteryAccount>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct LotteryAccount {
    pub owner: Pubkey,
    pub minimal_deposit_amount: u64,
}