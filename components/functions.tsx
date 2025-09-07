export function capitalizeNameAdvanced(name: string) {
    if (!name || typeof name !== 'string') {
        return '';
    }

    return name.trim().toLowerCase()
        .split(/(\s+|-|')/) // Split on spaces, hyphens, and apostrophes
        .map(part => {
            // Only capitalize if it's not a separator
            if (part.match(/\s+|-|'/)) {
                return part;
            }
            return part.charAt(0).toUpperCase() + part.slice(1);
        })
        .join('');
}