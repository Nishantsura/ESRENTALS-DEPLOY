import algoliasearch from 'algoliasearch'

// Check for Algolia environment variables but don't throw during build time
const hasAlgoliaConfig = !!(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID && process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY)

// Log warning instead of throwing error to allow builds to complete
if (!hasAlgoliaConfig) {
  console.warn('Warning: Algolia environment variables are not set. Search functionality will be limited.')
}

// Create Algolia client instance with optimized settings
// Use default placeholder values if environment variables are missing
export const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? 'PLACEHOLDER_APP_ID',
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY ?? 'PLACEHOLDER_SEARCH_KEY'
)

// Initialize index with optimized settings
export const carsIndex = searchClient.initIndex('autoluxe-dxb')

// Configure index settings for better performance
export const configureAlgoliaIndex = async () => {
  console.log('Starting Algolia index configuration...')
  
  try {
    console.log('Setting index settings...')
    await carsIndex.setSettings({
      // Optimized searchable attributes order
      searchableAttributes: [
        'unordered(name)',
        'unordered(brand)',
        'unordered(model)',
        'unordered(type)',
        'unordered(fuelType)',
        'unordered(description)'
      ],
      // Optimized faceting
      attributesForFaceting: [
        'searchable(brand)',
        'searchable(type)',
        'searchable(fuelType)',
        'searchable(transmission)',
        'filterOnly(price)',
        'filterOnly(year)'
      ],
      // Distinct results to avoid duplicates
      distinct: true,
      // Optimize relevance
      ranking: [
        'typo',
        'geo',
        'words',
        'filters',
        'proximity',
        'attribute',
        'exact',
        'custom'
      ]
    })
    console.log('Index settings updated successfully')
  } catch (error) {
    console.error('Error configuring Algolia index:', error)
    throw error
  }
}

// Note: All Firestore/Firebase logic has been removed. If you need to reindex from Supabase, create a server-only script for that purpose.
