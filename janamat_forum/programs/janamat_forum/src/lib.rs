use anchor_lang::prelude::*;

declare_id!("J5t84a3NbVBUEzi3qfaQBTVpT5egmV6e6E6MeQfr7yHi");

#[program]
pub mod janamat_forum {
    use super::*;

    pub fn create_forum(ctx: Context<CreateForum>, date: u64) -> Result<()> {
        let forum = &mut ctx.accounts.forum;
        let daily_limit = &mut ctx.accounts.daily_limit;
        let clock = Clock::get()?;
        let current_date = get_date_from_timestamp(clock.unix_timestamp);
        
        require!(date == current_date, ErrorCode::InvalidDate);

        // Initialize forum account
        forum.forum_id = forum.key();
        forum.creator = ctx.accounts.creator.key();
        forum.created_at = clock.unix_timestamp;
        forum.upvotes = 0;
        forum.downvotes = 0;

        // Initialize daily limit PDA
        daily_limit.wallet = ctx.accounts.creator.key();
        daily_limit.date = date;

        msg!("Forum created: {}", forum.forum_id);
        Ok(())
    }

    pub fn vote(ctx: Context<Vote>, vote_type: i8) -> Result<()> {
        require!(vote_type == 1 || vote_type == -1, ErrorCode::InvalidVoteType);

        let vote_account = &mut ctx.accounts.vote_account;
        let forum = &mut ctx.accounts.forum;

        // Initialize vote account (prevents double voting via PDA)
        vote_account.voter = ctx.accounts.voter.key();
        vote_account.target_id = forum.key();
        vote_account.vote_type = vote_type;

        // Update forum vote counts
        if vote_type == 1 {
            forum.upvotes = forum.upvotes.checked_add(1).unwrap();
        } else {
            forum.downvotes = forum.downvotes.checked_add(1).unwrap();
        }

        msg!("Vote recorded: {} on forum {}", vote_type, forum.forum_id);
        Ok(())
    }
}

// Helper function to get YYYYMMDD from Unix timestamp
fn get_date_from_timestamp(timestamp: i64) -> u64 {
    // Simple date extraction (timestamp / 86400 gives day count since epoch)
    // For production, use a proper date library
    (timestamp / 86400) as u64
}

#[derive(Accounts)]
#[instruction(date: u64)]
pub struct CreateForum<'info> {
    #[account(
        init,
        payer = creator,
        space = 8 + ForumAccount::INIT_SPACE
    )]
    pub forum: Account<'info, ForumAccount>,

    #[account(
        init,
        payer = creator,
        space = 8 + DailyForumLimit::INIT_SPACE,
        seeds = [b"limit", creator.key().as_ref(), &date.to_le_bytes()],
        bump
    )]
    pub daily_limit: Account<'info, DailyForumLimit>,

    #[account(mut)]
    pub creator: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Vote<'info> {
    #[account(
        init,
        payer = voter,
        space = 8 + VoteAccount::INIT_SPACE,
        seeds = [b"vote", forum.key().as_ref(), voter.key().as_ref()],
        bump
    )]
    pub vote_account: Account<'info, VoteAccount>,

    #[account(mut)]
    pub forum: Account<'info, ForumAccount>,

    #[account(mut)]
    pub voter: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct ForumAccount {
    pub forum_id: Pubkey,
    pub creator: Pubkey,
    pub created_at: i64,
    pub upvotes: u64,
    pub downvotes: u64,
}

#[account]
#[derive(InitSpace)]
pub struct VoteAccount {
    pub voter: Pubkey,
    pub target_id: Pubkey,
    pub vote_type: i8,
}

#[account]
#[derive(InitSpace)]
pub struct DailyForumLimit {
    pub wallet: Pubkey,
    pub date: u64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Vote type must be +1 or -1")]
    InvalidVoteType,
    #[msg("Date must be the current date")]
    InvalidDate,
}
