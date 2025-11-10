-- Cleanup Script: Remove existing test data from published_notes
-- Run this FIRST if you get duplicate key errors

DELETE FROM public.published_notes 
WHERE note_key IN (
  'polity-preamble-complete',
  'article-15-constitution',
  'polity-article-15-equality',
  'polity-article-14-equality',
  'history-french-revolution',
  'economics-supply-demand',
  'article-15-constitution'
);

-- Verify deletion
SELECT COUNT(*) as remaining_notes FROM public.published_notes;
