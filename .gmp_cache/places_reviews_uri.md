# Return the URI to Open the Read Reviews Page in Google Maps for a Place

This capability retrieves a direct link (`reviewsUri`) that opens Google Maps to
the reviews section of a specific place. It is supported across Text Search
(New), Nearby Search (New), and Place Details (New) requests.

## Prerequisites

This capability extends base Places API requests. Before using it, you must
configure one of the following base requests:

-   **Text Search (New)**: Return information about places based on a query
    string (`POST https://places.googleapis.com/v1/places:searchText`).
-   **Nearby Search (New)**: Return information about places near a specific
    location (`POST https://places.googleapis.com/v1/places:searchNearby`).
-   **Place Details (New)**: Return detailed information about a specific place
    (`GET https://places.googleapis.com/v1/places/{place_id}`).

## Implementation

To return the URI to read reviews for a place in Google Maps, include
`googleMapsLinks.reviewsUri` (or the parent `googleMapsLinks` object to retrieve
all available Google Maps links) in the `X-Goog-FieldMask` header of your
request.

### Field Mask Configuration

Endpoint                | Field Mask Header Value (Specific Link) | Field Mask Header Value (All Links)
:---------------------- | :-------------------------------------- | :----------------------------------
**Text Search (New)**   | `places.googleMapsLinks.reviewsUri`     | `places.googleMapsLinks`
**Nearby Search (New)** | `places.googleMapsLinks.reviewsUri`     | `places.googleMapsLinks`
**Place Details (New)** | `googleMapsLinks.reviewsUri`            | `googleMapsLinks`

> **Note:** If you are also requesting individual review objects (`reviews`) or
> the review summary (`reviewSummary`), note that `reviews.googleMapsUri`
> provides a link to a specific review, while `reviewSummary.reviewsUri`
> contains the same link as `googleMapsLinks.reviewsUri`.

## Code Examples

### Example 1: Text Search (New) Requesting Only the Reviews URI

```bash
curl -X POST -d '{
  "textQuery" : "San Francisco International Airport"
}' \
-H 'Content-Type: application/json' \
-H 'X-Goog-Api-Key: YOUR_API_KEY' \
-H 'X-Goog-FieldMask: places.displayName,places.googleMapsLinks.reviewsUri' \
-H 'X-Goog-Maps-Solution-ID: gmp_git_agentskills_v1' \
'https://places.googleapis.com/v1/places:searchText'
```

### Example 2: Place Details (New) Requesting the Reviews URI

```bash
curl -X GET \
-H 'Content-Type: application/json' \
-H 'X-Goog-Api-Key: YOUR_API_KEY' \
-H 'X-Goog-FieldMask: displayName,googleMapsLinks.reviewsUri' \
-H 'X-Goog-Maps-Solution-ID: gmp_git_agentskills_v1' \
'https://places.googleapis.com/v1/places/ChIJVVVVVYx3j4ARP-3NGldc8qQ'
```

## Response Structure

The API returns the `reviewsUri` nested within the `googleMapsLinks` object for
the place:

```json
{
  "places": [
    {
      "displayName": {
        "text": "San Francisco International Airport",
        "languageCode": "en"
      },
      "googleMapsLinks": {
        "reviewsUri": "https://www.google.com/maps/place//data=!4m4!3m3!1s0x808f778c55555555:0xa4f25c571acded3f!9m1!1b1"
      }
    }
  ]
}
```
