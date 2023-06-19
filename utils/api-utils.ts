import {openmrsFetch} from '@openmrs/esm-framework'

export const invItemURL = '/ws/rest/v2/inventory/inventoryStockTakeSummary?stockroom_uuid=10c9d0a5-493e-4a19-9bc0-2d82b17b8906'

export const fetcher = (url: string) =>
  openmrsFetch(url, {
    method: 'GET',
  })

export const postApiCall = (url, data, abortController) => {
  return openmrsFetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(data),
    signal: abortController.signal,
  })
}

export const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
}