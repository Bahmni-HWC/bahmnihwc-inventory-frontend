
export const invItemURL = 'openmrs/ws/rest/v2/inventory/item'

export const fetcher = async (url) => await fetch(url).then((res) => res.json())
export const postRequest = async (url, data) => {
  console.log('url', url, data)
  return await fetch(`${url}`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": "token-value",
    },
    body: JSON.stringify(data),
  });
}
  

export const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
}