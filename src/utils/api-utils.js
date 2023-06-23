
export const invItemURL = 'openmrs/ws/rest/v2/inventory/item'

export const fetcher = async(url) => await fetch(url).then((res) => res.json())
  

export const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
}