# Combine template + commits
TEMPLATE=$(cat .github/pull_request_template.md)
COMMITS=$(git log --format="- %s" main..HEAD)
echo -e "$TEMPLATE\n\n## Commits\n$COMMITS" | gh pr create --title "$1" --body-file -