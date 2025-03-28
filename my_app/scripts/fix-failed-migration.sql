-- Mark the failed migration as skipped
UPDATE "_prisma_migrations" 
SET "finished_at" = NOW(),
    "applied_steps_count" = 0,
    "logs" = 'Migration skipped due to duplicate structures'
WHERE "migration_name" = '20250316021046_add_tappass_member_models'; 