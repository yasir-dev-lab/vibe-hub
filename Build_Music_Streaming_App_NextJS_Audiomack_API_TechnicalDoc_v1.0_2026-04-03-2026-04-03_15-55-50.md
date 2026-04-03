<div align="center">

# Build a Music Streaming Web Application

</div>

Using Next.js 15 and the Audiomack Data API

Technical Documentation

Version 1.0 | April 3, 2026

Target Audience: Full-Stack Developers, AI Coding Agents

Document Type: Integration Guide / API Reference

Prerequisites: Intermediate knowledge of React, Next.js, TypeScript, OAuth 1.0a, and REST APIs.

Primary Reference: https://audiomack.com/data-api/docs

## Table of Contents

## 1. Introduction

## 2. Background and Context

2. 1 What is Audiomack?

2. 2 Why Next.js for Music Streaming?

2. 3 Overview of the Audiomack Data API

## 3. Audiomack API Reference

3. 1 General Information

3. 2 Authentication (OAuth 1.0a)

3. 3 Filtering and Pagination

3. 4 Error Handling

3. 5 Music Endpoints

3. 6 Artist Endpoints

3. 7 Playlist Endpoints

3. 8 Search Endpoints

3. 9 User Endpoints

3. 10 Charts and Stats Endpoints

3. 11 Image Sizes

## 4. Architecture Design

4. 1 System Architecture Overview

4. 2 Project Structure

4. 3 Technology Stack

## 5. Step-by-Step Implementation Guide

5. 1 Environment Setup

5. 2 OAuth 1.0a Authentication Module

5. 3 API Client Library

5. 4 Audio Player Component

5. 5 Key UI Pages and Components

5. 6 State Management for Playback

## 6. Advanced Topics

6. 1 Streaming URL Lifecycle Management

6. 2 Caching and Performance

6. 3 Rate Limiting and Error Resilience

6. 4 Metrics and Analytics Integration

7. Limitations and Considerations

8. Conclusion and Future Outlook

9. References

## 1. Introduction

The global music streaming industry has experienced exponential growth over the past decade, with platforms like Spotify, Apple Music, and SoundCloud dominating the market. However, independent artists and niche music communities often rely on alternative platforms that provide more flexible upload policies and discovery mechanisms. Audiomack has emerged as one of the leading platforms for independent artists, particularly in hip-hop, electronic, and R&B; genres, offering free music uploads and a robust API for developers to build custom music experiences.

This technical documentation provides a comprehensive, step-by-step guide for building a music streaming web application using Next.js 15 with the App Router architecture and the official Audiomack Data API. The document is designed for full-stack developers and AI coding agents who need detailed, actionable instructions to implement a production-ready music streaming application. All API references in this document are sourced directly from the official Audiomack API documentation at https://audiomack.com/data-api/docs [1], ensuring accuracy and reliability of the integration patterns described herein.

The guide covers the complete development lifecycle, from understanding the Audiomack API structure and authentication flow, through architectural design decisions and project scaffolding, to implementing core features such as music browsing, audio playback, playlist management, search functionality, and user authentication. Advanced topics including streaming URL lifecycle management, caching strategies, and error resilience are also addressed to ensure the resulting application meets production quality standards. By following this guide, developers will be able to create a fully functional music streaming application that leverages Audiomack's extensive music catalog while maintaining a modern, responsive user interface.

## 2. Background and Context

## 2.1 What is Audiomack?

Audiomack is a music streaming and discovery platform founded in 2009 that has grown to serve millions of users worldwide. Unlike mainstream platforms that require label agreements or paid subscriptions for artists to upload content, Audiomack provides free, unlimited uploads for independent artists. This open approach has made it the platform of choice for emerging artists in hip-hop, rap, electronic, R&B;, and afrobeats genres. The platform supports both streaming and downloading of music, with content organized by genres, trending charts, and curated playlists. Notable artists such as J. Cole, Chance the Rapper, and Young Thug have used Audiomack for exclusive releases, demonstrating the platform's credibility in the music industry [2].

From a developer's perspective, Audiomack offers a comprehensive Data API that provides programmatic access to the platform's music catalog, artist information, playlists, search functionality, and user management features. The API uses the OAuth 1.0a protocol for authentication, ensuring secure access to user-specific operations such as favoriting tracks, following artists, and managing playlists. All API responses are delivered in JSON format over HTTPS, making it straightforward to integrate with modern web frameworks. The API base endpoint is located at https://api.audiomack.com/v1 [1].

## 2.2 Why Next.js for Music Streaming?

Next.js 15, developed by Vercel, is a React-based framework that provides a robust set of features ideally suited for building music streaming applications. The framework's App Router architecture, introduced in Next.js 13 and refined through subsequent releases, offers a file-system-based routing approach that simplifies the creation of complex page hierarchies common in music applications (e.g., /artist/[slug], /album/[id], /genre/[name]). Server Components by default reduce the JavaScript bundle sent to the client, resulting in faster initial page loads, which is critical for retaining users on bandwidth-sensitive mobile devices [3].

Several technical features make Next.js particularly well-suited for music streaming applications. Server-Side Rendering (SSR) enables dynamic metadata generation for SEO, ensuring that individual song and album pages are properly indexed by search engines. Static Site Generation (SSG) can be used for relatively stable content like genre pages and top charts. API Routes provide a natural backend proxy layer for the Audiomack API, allowing developers to securely store OAuth credentials and implement server-side caching without exposing sensitive data to the client. Additionally, Next.js's built-in image optimization component handles automatic resizing and format conversion of album artwork, significantly improving page load performance. The framework's middleware support enables global authentication checks and rate limiting across all API routes, which is essential when working with third-party music APIs [4].

## 2.3 Overview of the Audiomack Data API

The Audiomack Data API provides a RESTful interface organized around core resource types: Music, Artists, Playlists, Users, Charts, and Search. The API supports both public endpoints (for browsing music, viewing artist profiles, and searching) and authenticated endpoints (for favoriting, following, playlist management, and

user-specific feeds). Authentication follows the OAuth 1.0a three-legged flow, where a consumer application obtains a request token, directs the user to authorize it on Audiomack, and then exchanges the authorized request token for an access token. Access tokens expire after one year, requiring periodic re-authorization [1].

The API supports field-level filtering through the fields query parameter, allowing clients to request only the specific data fields they need. This reduces bandwidth consumption, which is particularly important for mobile clients. Pagination is supported via either the / page/ X path segment (returning 20 results per page) or a limit=0 query parameter for retrieving all results at once. All responses include a count field indicating the total number of available results, enabling proper pagination UI implementation [1].

## 3. Audiomack API Reference

This section provides a detailed reference for all Audiomack API endpoints relevant to building a music streaming application. All endpoints are relative to the base URL https://api.audiomack.com/v1. Requests must be sent over HTTPS. All responses are in JSON format [1].

## 3.1 General Information

The Audiomack API is organized into logical resource groups, each with its own set of endpoints. The table below summarizes the major resource categories and the operations available for each. Developers should note that read operations (GET requests) are generally available without authentication, while write operations (PUT, DELETE, POST) require a valid OAuth access token. The API uses standard HTTP methods and status codes, making it compatible with any HTTP client library.

<table border="1"><tr><td>Resource</td><td>Base Path</td><td>Auth Required</td><td>Description</td></tr><tr><td>Music</td><td>/v1/music</td><td>Partial</td><td>Songs, albums, trending, recent, play</td></tr><tr><td>Artists</td><td>/v1/artist</td><td>Partial</td><td>Profiles, uploads, favorites, follow</td></tr><tr><td>Playlists</td><td>/v1/playlist</td><td>Partial</td><td>Create, edit, delete, tracks</td></tr><tr><td>Users</td><td>/v1/user</td><td>Yes</td><td>Details, feed, uploads, notifications</td></tr><tr><td>Charts</td><td>/v1/chart</td><td>No</td><td>Trending tracks and playlists</td></tr><tr><td>Search</td><td>/v1/search</td><td>No</td><td>Songs, albums, artists, autosuggest</td></tr><tr><td>Stats</td><td>/v1/stats</td><td>No</td><td>Playback statistics tokens</td></tr></table>

## 3.2 Authentication (OAuth 1.0a)

The Audiomack API uses the OAuth 1.0a three-legged authentication protocol for user-specific operations. This protocol ensures that user credentials are never shared directly with the consuming application. Instead, the application receives an access token that grants limited, scoped access to the user's account on behalf of the user. The authentication flow consists of three distinct steps: obtaining a request token, user authorization, and exchanging for an access token [1].

## Step 1: Obtain a Request Token

The consumer application sends a POST request to the request token endpoint. The request must be signed with the consumer key and consumer secret. A callback URL must also be provided, to which the user will be redirected after authorization.

POST /v1/ request_token

Required Parameter: oaut h_call back - The absolute URL to which the service provider will redirect the user after authorization. If the consumer cannot receive callbacks, use oob for out-of-band configuration.

Response: The service provider returns a URL-encoded string containing the request token, token secret, and a callback confirmation flag:

oaut h_t oken=f foo&amp; oaut h_t oken_secr et=bar &amp; oaut h_cal l back_conf i r med=t r ue

Important: Request tokens are valid for only one hour after creation. The authorization flow must be completed within this window.

## Step 2: User Authorization

The consumer redirects the user to the Audiomack authorization page. The user logs in and grants or denies access to the consumer application. This request must NOT be signed (no OAuth parameters other than the token are required).

GET https://audiomack.com/oauth/authenticat?oauth_token=foo

Required Parameter: oaut h_t token - The request token obtained in the previous step.

Response: After the user authorizes the application, they are redirected to the callback URL with two additional GET parameters: oaut h_token (the authorized request token) and oaut h_verifier (a verification code).

## Step 3: Obtain an Access Token

The consumer exchanges the authorized request token and verification code for a permanent (one-year) access token. This is an OAuth-signed request.

POST /v1/ access_token

Required Parameters: oaut h_consumer_key, oaut h_token, oaut h_si gnat ur e_method, oaut h_si gnat ur e, oaut h_t i m est amp, oaut h_nonce, oaut h_ver i f i e r.

Response: On successful validation, the service provider returns an access token and its secret:

oaut h_t token=f foo&amp; oaut h_t token_secr et=bar

Note: Access tokens expire 1 year after creation. The expiration timestamp is provided as a UNIX timestamp. Store tokens locally and plan for re-authorization. Expired tokens return a 401 Unauthorized status with error code 1003.

## 3.3 Filtering and Pagination

The Audiomack API provides powerful filtering capabilities that allow clients to reduce bandwidth by requesting only specific fields. Most GET endpoints support the fields parameter, which accepts a comma-separated list of field names. Nested fields can be accessed using the field: subfield notation. For example, to retrieve only the artist name alongside song titles from chart data:

GET /v1/ chart / playlists/ weekly?fields=artist:name,title,image,id

Pagination is supported through two mechanisms. The primary method appends / page/ X to the endpoint path, where X is the page number (each page returns 20 results). Alternatively, passing limit=0 as a query parameter retrieves all results in a single response. The page value must precede any query parameters in the URL [1].

# Pagi nated request (second page, filtered fields) GET

/ v1/ musi c/ recent / page/ 2?fields=i d, title # Retrieve all results at once GET

/ v1/ musi c/ recent?limit=0 # Combine filtering with limit GET

/ v1/ artist / glen-scott / favorites?show=musi c&amp; fields=i d&amp; limit=0

All paginated responses include a count field indicating the total number of available results, which enables proper pagination UI controls in the frontend application. Developers should use the count to calculate total pages and display appropriate navigation elements.

## 3.4 Error Handling

The API returns standard HTTP status codes to indicate the outcome of each request. A status code of 200 indicates success, while 4XX codes indicate client-side errors and 5XX codes indicate server-side issues. In addition to the status code, error responses include a JSON payload with detailed information about the error.

Error Response Structure:

// Standard error with description {"errorcode":1002,"message":"The artist you requested could not be found."} // Validation errors (multiple fields)

{"errorcode":1008,"message":"Validation failed", "errors":{"email":{"isEmpty":"This field is required"}}, "password2":{"notSame":"Passwords do not match"}}}

Common Error Codes:

<table border="1"><tr><td>Code</td><td>HTTP Status</td><td>Message</td><td>Cause</td></tr><tr><td>1000</td><td>422</td><td>Music is already favorited</td><td>Duplicate favorite action</td></tr><tr><td>1001</td><td>422</td><td>Cannot unfavorite non-favorite</td><td>Item not in favorites</td></tr><tr><td>1002</td><td>404</td><td>Artist not found</td><td>Invalid artist slug</td></tr><tr><td>1003</td><td>401</td><td>Invalid access token</td><td>Expired or bad OAuth token</td></tr><tr><td>1004</td><td>401</td><td>Request unauthorized</td><td>Missing auth on protected endpoint</td></tr><tr><td>1005</td><td>404</td><td>Song not found</td><td>Invalid music ID or slug</td></tr><tr><td>1006</td><td>503</td><td>User details retrieval failed</td><td>Temporary server issue</td></tr><tr><td>1007</td><td>503</td><td>Could not create access token</td><td>Token creation failure</td></tr><tr><td>1008</td><td>422</td><td>Validation failed</td><td>Invalid input parameters</td></tr><tr><td>1009</td><td>422</td><td>Username/password required</td><td>Missing login credentials</td></tr><tr><td>1010</td><td>503</td><td>Artist details retrieval failed</td><td>Temporary server issue</td></tr><tr><td>1011</td><td>500</td><td>Password reset email failed</td><td>Email service issue</td></tr></table>

## 3.5 Music Endpoints

Music endpoints form the core of the Audiomack API, providing access to song and album metadata, streaming URLs, trending charts, and user interactions like favoriting and reposting. These are the most frequently used endpoints in any music streaming application, as they power the browse, discover, and playback features.

## 3.5.1 Song or Album Info

Retrieve detailed information about a specific song or album. Two identification methods are supported: by music ID (numeric) or by artist and music slug (URL-friendly strings).

// Option 1: By music ID GET /v1/ music/:id // Option 2: By artist slug and music slug GET /v1/ music/ ( song| album)/( artist slug)/( song or album slug)

Optional Parameter: key - Promotional key for accessing private tracks. The response includes comprehensive metadata such as title, artist, genre, uploader details, description, artwork URL, streaming_url, and streaming_url_timeout. Note that the streaming_url is a time-limited, pre-signed URL valid for approximately 10 seconds only.

## 3.5.2 Song Previews

Retrieve a short audio preview for a given music ID. This is useful for browse-and-preview experiences where full playback is not desired.

GET / v1/ musi c/ previ ew/ : i d

Response Codes: 200 (audio content, Content-Type: audio/mp4 or audio/mpeg), 403 (preview cannot be generated), 405 (method not allowed), 408 (timeout during retrieval, retry after delay), 422 (invalid parameter), 503 (internal error, retry).

## 3.5.3 Most Recent Music

Retrieve the most recently uploaded music across all genres. This endpoint supports pagination and filtering.

// All genres GET /v1/ musi c/recent // Genre-specific GET /v1/ musi c/( genre)/recent // Example: Recent rap songs GET /v1/ musi c/rap/recent

Response Format: JSON object containing a results array of music entities and a count field for the total number of available results. Supports the / page/ X pagination pattern and fields filtering.

## 3.5.4 Trending Music

Retrieve trending (popular) music, either across all genres or filtered by a specific genre. This is the primary endpoint for powering "Trending" or "Popular" sections in the application.

// All genres trending GET /v1/ musi c/ trending // Genre-specific trending GET /v1/ musi c/ (genre)/ trending // Example: Trending electronic music GET /v1/ musi c/ electroni c/ trending

Supported genre values include rap and electronic, among others. The response format matches the most recent endpoint, with results array and count field.

## 3.5.5 Play a Track

Request a streaming URL for a specific track. This is the critical endpoint for audio playback, as it returns a time-limited, pre-signed URL to the MP3 audio file. The streaming URL must be requested just before playback begins, as it expires within approximately 10 seconds.

POST / v1/ musi c/ : i d/ pl ay

Optional Parameters:

session - Unique user session identifier (recommended for tracking play statistics)

album_id - Album context the track belongs to

playlist_id - Playlist context the track belongs to

hq - Request highest quality streaming source

key - Promotional key for private tracks

Response: A pre-signed streaming URL string pointing to the MP3 file. For mobile applications, the device's unique ID can be used as the session value. The session parameter is strongly recommended for accurate play statistics tracking.

## 3.5.6 Favorite / Unfavorite a Song or Album

Allow authenticated users to add or remove songs and albums from their favorites collection. Requires a valid OAuth access token.

// Add to favorites PUT /v1/ musi c/:id/favorite // Remove from favorites DELETE /v1/ musi c/:id/favorite

Response: HTTP 204 (No Content) on success. Error 1000 if already favorited, error 1001 if trying to unfavorite an item that is not in favorites.

## 3.5.7 Repost / Un-Repost a Song or Album

Allow authenticated users to repost or remove reposts of songs and albums. Requires a valid OAuth access token.

// Repost PUT /v1/ musi c/:i d/ repost // Remove repost DELETE /v1/ musi c/:i d/ repost

Response: HTTP 204 (No Content) on success.

## 3.5.8 Track Metrics

Retrieve real-time engagement metrics for a specific music object. Events are aggregated within the last 60 minutes.

GET /v1/ musi c/: i d/ met r i c s

Response: Returns event counters (e.g., play count, repost count) for the specified track.

{"results": { "event_counters": { "play": 345, "repost": 15 } }}

## 3.5.9 Flagging Unplayable Tracks

Report a track as unplayable when the streaming source returns errors (e.g., 404). This helps the platform maintain content quality.

PATCH / v1/ musi c/ ( song| album) / ( artist slug) / ( song or album slug) // Parameters:

st at us=unplayable

## 3.6 Artist Endpoints

Artist endpoints provide access to artist profiles, their uploads, favorites, playlists, social graph (followers/following), and activity feed. Artist information is retrieved using a URL slug, which is available in music entities under the uploader. url_slug field. The artist entity includes fields such as name, bio, image, hometown, genre, social media links (Twitter, Facebook, Instagram), label, and engagement metrics (follower count, upload count, favorites count, playlists count) [1].

<table border="1"><tr><td>Endpoint</td><td>Method</td><td>Auth Required</td><td>Description</td></tr><tr><td>/v1/artist/(slug)</td><td>GET</td><td>No</td><td>Retrieve artist profile information</td></tr><tr><td>/v1/artist/(slug)/uploads</td><td>GET</td><td>No</td><td>Get music uploaded by artist (paginated)</td></tr><tr><td>/v1/artist/(slug)/favorites</td><td>GET</td><td>No</td><td>Get artist&#x27;s favorited music</td></tr><tr><td>/v1/artist/(slug)/favorites/search</td><td>GET</td><td>No</td><td>Search within artist&#x27;s favorites</td></tr><tr><td>/v1/artist/(slug)/playlists</td><td>GET</td><td>No</td><td>Get artist&#x27;s playlists (filterable by genre)</td></tr><tr><td>/v1/artist/(slug)/follow</td><td>PUT</td><td>Yes</td><td>Follow an artist</td></tr><tr><td>/v1/artist/(slug)/follow</td><td>DELETE</td><td>Yes</td><td>Unfollow an artist</td></tr><tr><td>/v1/artist/(slug)/following</td><td>GET</td><td>No</td><td>Get artists this artist follows</td></tr><tr><td>/v1/artist/(slug)/follows</td><td>GET</td><td>No</td><td>Get followers of this artist</td></tr><tr><td>/v1/artist/(slug)/feed</td><td>GET</td><td>No</td><td>Get artist&#x27;s activity feed (paginated)</td></tr><tr><td>/v1/artist/:id/metrics</td><td>GET</td><td>No</td><td>Get real-time engagement metrics</td></tr></table>

The artist favorites endpoint supports filtering through the show parameter, which accepts values of all (default), music, song, album or playlist. The favorites search endpoint accepts a q parameter for text-based search within the artist's favorites. The playlists endpoint can be filtered by genre using the genre query parameter (e.g., GET /v1/artist/ (slug)/playlists?genre=rap).

## 3.7 Playlist Endpoints

Playlist endpoints enable full playlist lifecycle management: creating, editing, deleting playlists, and managing their track contents. Read operations for public playlists do not require authentication, while write operations and favoriting require a valid OAuth access token. Playlists are identified by their unique ID or slug, and each playlist entity includes metadata such as title, genre, track count, creation/update timestamps, privacy status, and associated artwork.

<table border="1"><tr><td>Endpoint</td><td>Method</td><td>Auth Required</td><td>Description</td></tr><tr><td>/v1/playlist/(slug)/trending</td><td>GET</td><td>No</td><td>Get trending playlists (genre-specific)</td></tr><tr><td>/v1/playlist/create</td><td>POST</td><td>Yes</td><td>Create a new playlist</td></tr><tr><td>/v1/playlist/:id</td><td>PATCH</td><td>Yes</td><td>Edit playlist metadata (title, genre, etc.)</td></tr><tr><td>/v1/playlist/:id</td><td>DELETE</td><td>Yes</td><td>Delete a playlist</td></tr><tr><td>/v1/playlist/:id/songs</td><td>PUT</td><td>Yes</td><td>Add song(s) to a playlist</td></tr><tr><td>/v1/playlist/:id/songs/:song_id</td><td>DELETE</td><td>Yes</td><td>Remove a song from a playlist</td></tr><tr><td>/v1/playlist/(slug)</td><td>GET</td><td>No</td><td>Get playlist info (track IDs)</td></tr><tr><td>/v1/playlist/(slug)/tracks</td><td>GET</td><td>No</td><td>Get playlist details (full track data)</td></tr><tr><td>/v1/playlist/:id/favorite</td><td>PUT</td><td>Yes</td><td>Favorite a playlist</td></tr><tr><td>/v1/playlist/:id/favorite</td><td>DELETE</td><td>Yes</td><td>Unfavorite a playlist</td></tr><tr><td>/v1/playlist/:id/metrics</td><td>GET</td><td>No</td><td>Get real-time playlist engagement metrics</td></tr></table>

## 3.8 Search Endpoints

Search functionality is critical for any music application. The Audiomack API provides two search endpoints: a full search endpoint that returns songs, albums, and artists matching a query, and an autosuggest endpoint optimized for type-ahead search experiences. Both endpoints do not require authentication and support the standard fields filtering parameter.

## Full Search

// Search for songs, albums, and artists GET /v1/ search/ (artist slug)?q=search_term // Returns: songs, albums, artists matching the query

## Autosuggest

The autosuggest endpoint is designed for real-time search-as-you-type functionality. It returns lightweight results suitable for dropdown suggestions, minimizing latency and bandwidth for responsive search experiences.

// Search autosuggest ( type-ahead) GET /v1/ search/ ( artist slug) ?q=search_t er m&amp; autosuggest =true

For optimal user experience, implement debouncing (300-500ms delay) on the client side when using the autosuggest endpoint to avoid excessive API calls during rapid typing. Combined with the fields parameter to

request only title and artist name, this provides a fast, efficient search experience.

## 3.9 User Endpoints

User endpoints require authentication and provide access to the authenticated user's personal data, including profile details, playlists, favorites, upload history, activity feed, and notifications. These endpoints are essential for building a personalized experience within the music streaming application.

<table border="1"><tr><td>Endpoint</td><td>Method</td><td>Description</td></tr><tr><td>/v1/user</td><td>GET</td><td>Get authenticated user's profile details</td></tr><tr><td>/v1/user/register</td><td>POST</td><td>Register a new user account</td></tr><tr><td>/v1/user/password</td><td>POST</td><td>Request password reset/retrieval</td></tr><tr><td>/v1/user/playlists</td><td>GET</td><td>Get user's playlists</td></tr><tr><td>/v1/user/favorites</td><td>GET</td><td>Get user's favorited items</td></tr><tr><td>/v1/user/feed</td><td>GET</td><td>Get user's activity feed</td></tr><tr><td>/v1/user/uploads</td><td>GET</td><td>Get user's uploaded music</td></tr><tr><td>/v1/user/notifications</td><td>GET</td><td>Get user's notifications</td></tr><tr><td>/v1/user/pinned</td><td>GET</td><td>Get user's pinned contents</td></tr></table>

## 3.10 Charts and Stats Endpoints

Charts provide curated rankings of popular music and playlists, useful for building discovery features. Stats endpoints support playback analytics and event tracking integration, which is important for reporting play counts back to the Audiomack platform.

## Chart Tracks

// Get chart tracks (all genres) GET /v1/ chart/ playlists/weekly // Genre-specific charts GET /v1/ chart/ (genre)/ playlists/ (period)

The charts endpoint supports filtering with the fields parameter and returns track items with artist information, artwork, and ranking metadata.

## Stats Token and Recording

// Get a stats token for tracking GET /v1/stats/token // Record playback statistics POST /v1/stats/record

The stats token is required before recording playback events. This two-step process ensures that play statistics are accurately attributed and tracked. Use the session parameter from the play track endpoint to maintain

consistent tracking across playback sessions.

## 3.11 Image Sizes

Entity images (song artwork, artist avatars, playlist covers) are returned at a default size of 275x275 pixels. The original, higher-quality image (up to 1600x1600 pixels) can be requested by appending image_size=ori ginal to any API request. Use the default size for list views and thumbnails, and request the original size for detail pages or full-screen artwork displays to balance quality and bandwidth.

// Default size (275x275) GET /v1/ musi c/trending // Original size (up to 1600x1600) GET /v1/ musi c/trending?image_size=original

## 4. Architecture Design

## 4.1 System Architecture Overview

The music streaming application follows a layered architecture pattern that cleanly separates concerns between the presentation layer, API proxy layer, and external service integration. This architecture ensures that sensitive OAuth credentials never reach the client, server-side caching reduces load on the Audiomack API, and the application can gracefully handle API failures without exposing errors to end users. The architecture consists of three primary tiers: the Next.js client (React components and audio player), the Next.js API routes (server-side proxy and business logic), and the Audiomack API (external music data service).

The client tier handles all user-facing concerns: rendering the UI, managing audio playback state, handling user interactions, and displaying media content. The API proxy tier acts as an intermediary between the client and the Audiomack API, responsible for OAuth request signing, access token management, response caching, rate limiting, and error handling. By proxying all API calls through Next.js API routes, the consumer secret and access token secrets remain securely on the server, preventing credential leakage to the browser. The external tier is the Audiomack Data API itself, providing the music catalog, streaming URLs, and user management functionality.

## 4.2 Project Structure

A well-organized project structure is essential for maintainability and scalability. The following structure follows Next.js 15 App Router conventions while adding dedicated directories for API integration, audio management, and shared types. This modular layout allows AI coding agents and development teams to navigate the codebase efficiently and make targeted changes without unintended side effects.

music-app/ src/ app/ layout.tsx # Root layout with providers page.tsx # Homepage (trending + recent) globals.css # Global styles + Tailwind (browse)/ trending/page.tsx # Trending music page recent/page.tsx # Recent uploads page genre/[slug]/page.tsx # Genre-specific pages (discover)/ search/page.tsx # Search results page charts/page.tsx # Charts page (artist)/ [slug]/page.tsx # Artist profile page [slug]/ uploads/page.tsx # Artist uploads playlists/page.tsx # Artist playlists (music)/ [id]/page.tsx # Song/album detail page (playlist)/ [slug]/page.tsx # Playlist detail page (user)/ profile/page.tsx # User profile (auth required) favorites/page.tsx # User favorites (auth required) playlists/page.tsx # User playlists (auth required) api/audiomack/ music/ [id]/route.ts # Music info proxy trending/route.ts # Trending music proxy recent/route.ts # Recent music proxy play/route.ts # Streaming URL proxy artist/ [slug]/route.ts # Artist info proxy [slug]/ uploads/route.ts playlists/route.ts playlist/ [slug]/route.ts # Playlist proxy search/route.ts # Search proxy charts/route.ts # Charts proxy auth/ request-token/route.ts access-token/route.ts callback/route.ts components/ audio/ AudioPlayer.tsx # Main audio player component PlayerControls.tsx # Play/pause/seek controls ProgressBar.tsx # Track progress bar VolumeControl.tsx # Volume slider QueueManager.tsx # Play queue management layout/ Header.tsx # Navigation header Sidebar.tsx # Sidebar navigation Footer.tsx # Footer music/ TrackCard.tsx # Song/album card TrackList.tsx # List of tracks MusicGrid.tsx # Grid layout for cards GenrePill.tsx # Genre filter pill artist/ ArtistCard.tsx # Artist preview card ArtistHeader.tsx # Artist profile header search/ SearchBar.tsx # Search input with autosuggest SearchResults.tsx # Search results display playlist/

Playlist Card.tsx # Playlist preview card Playlist Tracks.tsx # Playlist track listing ui/ Button.tsx LoadingSpinner.tsx ErrorBoundary.tsx InfiniteScroll.tsx lib/ audiomack/client.ts # Audiomack API client library oauth.ts # OAuth 1.0a signing utilities types.ts # TypeScript type definitions constants.ts # API base URL, genres, etc. audio/player.ts # Audio playback manager store.ts # Playback state (Zustand) utils/ cache.ts # Server-side caching utility format.ts # Time, number formatters hooks/ useAudioplayer.ts # Audio player hook useInfiniteScroll.ts # Pagination hook useSearch.ts # Search with debounce useAudiomackAuth.ts # Auth state hook providers/ AuthProvider.tsx # Authentication context Player Provider.tsx # Audio player context middleware.ts # Auth checks, rate limiting

## 4.3 Technology Stack

The following technology stack is recommended for building a production-ready music streaming application with Next.js and the Audiomack API. Each technology has been selected based on its maturity, community support, and suitability for the specific requirements of a music streaming application.

<table border="1"><tr><td>Category</td><td>Technology</td><td>Purpose</td></tr><tr><td>Framework</td><td>Next.js 15(App Router)</td><td>SSR,SSG,API routes,routing</td></tr><tr><td>Language</td><td>TypeScript 5.x</td><td>Type safety across frontend and backend</td></tr><tr><td>Styling</td><td>Tailwind CSS 4</td><td>Utility-first responsive design</td></tr><tr><td>State Management</td><td>Zustand</td><td>Lightweight audio playback state</td></tr><tr><td>Audio Playback</td><td>HTML5 Audio API+Howler.js</td><td>Cross-browser audio playback</td></tr><tr><td>HTTP Client</td><td>fetch(native)+oauth-1.0a</td><td>API communication and OAuth signing</td></tr><tr><td>Caching</td><td>Next.js cache+Redis(optional)</td><td>Server-side response caching</td></tr><tr><td>Database</td><td>Prisma+PostgreSQL(optional)</td><td>User data,playlists,favorites sync</td></tr><tr><td>Authentication</td><td>NextAuth.js/Auth.js</td><td>Session management,OAuth flow</td></tr><tr><td>Deployment</td><td>Vercel</td><td>Edge functions,CDN,CI/CD</td></tr></table>

## 5. Step-by-Step Implementation Guide

## 5.1 Environment Setup

Before beginning development, ensure that the following prerequisites are installed and configured on your development machine. This guide assumes you are using Node.js 20 or later and a package manager such as npm, yarn, or pnpm.

## Step 1: Create the Next.js Project

```bash

# Create a new Next.js 15 project with TypeScript and Tailwind npx

create-next-app@atest music-app \ --typescript \ --tailwind \ --app \ --src-dir \

--eslint cd music-app npm install

```

## Step 2: Install Dependencies

# OAuth 1.0a signing (server-side only) npm install oauth-1.0a # State management for audio playback npm install zustand # Audio player library with cross-browser support npm install howler # Debounce utility for search npm install lodash.debounce # Dev dependency for types npm install -D @types/lodash.debounce @types/howler

## Step 3: Configure Environment Variables

Create a .env. local file in the project root to store Audiomack API credentials. These values must never be exposed to the client side and are only accessible within Next.js API routes and server components.

```bash

# .env.local AUDI OMACK_CONSUMER_KEY=your_consumer_key_here

AUDI OMACK_CONSUMER_SECRET=your_consumer_secret_here

AUDI OMACK_BASE_URL=https://api.audiomack.com/v1

AUDI OMACK_OAUTH_CALLBACK=http://local host:3000/api/audiomack/auth/callback # Optional:

Redis for server-side caching REDIS_URL=redis://local host:6379

```

Security Warning: Never commit .env.local to version control. Add it to your .gitignore file. The consumer key and secret must only be used server-side within API routes.

## 5.2 OAuth 1.0a Authentication Module

Implementing OAuth 1.0a on the server side is critical for securing all authenticated API interactions. The following module handles request signing using the oauth-1.0a library and provides utility functions for the three-step authentication flow. All OAuth operations must occur exclusively in API routes or server actions to prevent credential exposure to the browser.

## OAuth Utility Module

```javascript

// src/lib/audiomack/oauth.ts import OAuth from 'oauth-1.0a'; import crypto from

'crypto'; const CONSUMER_KEY = process.env.AUDIOMACK_CONSUMER_KEY!; const

CONSUMER_SECRET = process.env.AUDIOMACK_CONSUMER_SECRET!; const oauth = new OAuth({

consumer: { key: CONSUMER_KEY, secret: CONSUMER_SECRET }, signature_method:

'HMAC-SHA1', hash_function(baseString, key) { return crypto.createHmac('sha1', key)

.update(baseString) .digest('base64'); }, });

export function signRequest( method:

string, url: string, token?: { key: string; secret: string } ) { const requestData = {

url, method }; const authData = token ? { ...oauth.authorize(requestData, token) } : {

```

... oauth h. authorize( request Data ) }; return authData; } export function toHeader( oauthData: Record&lt; string, string&gt; ) { return oauth.toHeader( oauthData ); }

## Request Token API Route

```javascript

// src/app/api/audiomack/auth/request-token/route.ts import { NextResponse } from 'next/server'; import { signRequest, toHeader } from '@lib/audiomack/oauth'; const BASE_URL = process.env.AUDIOMACK_BASE_URL!; const CALLBACK =

process.env.AUDIOMACK_OAUTH_CALLBACK!; export async function POST() { try { const url =

 `${BASE_URL}/request_token`; const authData = signRequest('POST', url); const header =

toHeader(authData); const res = await fetch(url, { method: 'POST', headers: {

 ...header, 'Content-Type': 'application/x-www-form-urlencoded', }, body:

 `oauth_callback=${encodeURI Component(CALLBACK)}`, });

 const text = await res.text();

 const params = new URLSearchParams(text); return NextResponse.json({ oauth_token:

 params.get('oauth_token'), oauth_token_secret: params.get('oauth_token_secret'),

 oauth_callback_confirmed: params.get('oauth_callback_confirmed'), });

 } catch (error) {

 return NextResponse.json( { error: 'Failed to get request token' }, { status: 500 } );

 }

}

```

## Callback API Route

```javascript

// src/app/api/audiomack/auth/callback/route.ts import { NextRequest, NextResponse }

from 'next/server'; import { signRequest, toHeader } from '@lib/audiomack/oauth';

const BASE_URL = process.env.AUDIOMACK_BASE_URL!; export async function GET(request: NextRequest) { const { searchParams } = new URL(request.url); const oauth_token = searchParams.get('oauth_token'); const oauth_verifier = searchParams.get('oauth_verifier'); const oauth_token_secret = request.cookies.get('oauth_token_secret')?.value; if (!oauth_token || !oauth_verifier || !oauth_token_secret) { return NextResponse.redirect(new URL('/?auth=failed', request.url)); } try { const url = `${BASE_URL}/access_token`; const authData = signRequest('POST', url, { key: oauth_token, secret: oauth_token_secret, }); // Add oauth_verifier to the authorization header authData.oauth_verifier = oauth_verifier; const header = toHeader(authData); const res = await fetch(url, { method: 'POST', headers: { ...header }, }); const text = await res.text(); const params = new URLSearchParams(text); // Store access token in httpOnly cookie const response = NextResponse.redirect(new URL('/?auth=success', request.url)); response.cookies.set('am_access_token', params.get('oauth_token')!, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 365 * 24 * 60 * 60, // 1 year }); response.cookies.set('am_access_secret', params.get('oauth_token_secret')!, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 365 * 24 * 60 * 60, }); return response; } catch (error) { return NextResponse.redirect(new URL('/?auth=failed', request.url)); } }

```

## 5.3 API Client Library

The API client library serves as a centralized, typed interface to the Audiomack API. By encapsulating all API communication logic in a single module, the application benefits from consistent error handling, automatic OAuth signing for authenticated requests, response caching, and a clean separation between API integration code and UI components. All methods in the client library are designed to be called from Next.js API routes (server-side) or Server Components.

## TypeScript Type Definitions

```javascript

// src/lib/audiomack/types.ts export interface AudiomackMusic { id: string; title:

string; artist: string; type: 'song' | 'album'; genre: string; image: string; url_slug:

string; streaming_url?: string; streaming_url_timeout?: number; stream_only: string;

description: string; uploader: AudiomackArtist; featuring: string; album string;

released: string; status: string; time_ago: string; live: boolean; repost?: string; }

export interface AudiomackArtist { id: string; name: string; url_slug: string; image:

string; bio: string; hometown: string; twitter?: string; facebook?: string; instagram?: 

string; label: string; genre: string; verified?: string; followers_count?: number;

upload_count?: number; favorites_count?: number; playlists_count?: number;

following_count?: number; feed_count?: number; } export interface AudiomackPlaylist {

id: string; title: string; url_slug: string; genre: string; image: string; track_count:

number; artist: AudiomackArtist; created: string; updated: string; private: string;

type: string; } export interface AudiomackSearchResults { results: AudiomackMusic[];

count: number; }

```

## API Client Implementation

```javascript

// src/lib/audiomack/client.ts import { signRequest, toHeader } from './oauth'; import

type { AudiomackMusic, AudiomackArtist, AudiomackPlaylist, AudiomackSearchResults }

from './types'; const BASE_URL = process.env.AUDIOMACK_BASE_URL!; async function

audiomackFetch&lt;T&gt; ( endpoint: string, options: { method?: string; params?: 

Record&lt;t;string, string&gt;; authenticated?: boolean; token?: { key: string; secret: 

string }; body?: Record&lt;t;string, unknown&gt;; revalidate?: number; } = {} ):

Promise&lt;t;T&gt; { const { method = 'GET', params = {}, authenticated = false, token, 

body, revalidate = 300, // Cache for 5 minutes } = options; const url = new

URL(`${BASE_URL}${endpoint}`); Object.entries(params).forEach(([k, v]) =>

url.searchParams.set(k, v)); const headers: Record&lt;t;string, string&gt; = {}; if

(authenticated && token) { const authData = signRequest(method, url.toString(), token);

const authHeader = toHeader(authData); Object.assign(headers, authHeader); } else {

const authData = signRequest(method, url.toString()); const authHeader =

toHeader(authData); Object.assign(headers, authHeader); } const fetchOptions:

RequestInit = { method, headers, next: { revalidate }, }; if (body) { fetchOptions.body =

JSON.stringify(body); headers['Content-Type'] = 'application/json'; } const res =

await fetch(url.toString(), fetchOptions); if (!res.ok) { throw new Error( `Audiomack

API error: ${res.status}${res.statusText}` ); } return res.json(); } // --- Music API

Methods --- export const musicApi = { getMusicById(id: string) { return

audiomackFetch&lt;t;AudiomackMusic&gt;(`/music/${id}`); }, getMusicBySlug(type: string,

artistSlug: string, musicSlug: string) { return audiomackFetch&lt;t;AudiomackMusic&gt;(

`/music/${type}/${artistSlug}/${musicSlug}`); }, getRecent(page = 1) { return

audiomackFetch&lt;t;AudiomackSearchResults&gt;(`/music/recent/page/${page}`); },

getTrending(page = 1) { return audiomackFetch&lt;t;AudiomackSearchResults&gt;(

`/music/trending/page/${page}`); }, getGenreRecent(genre: string, page = 1) { return

audiomackFetch&lt;t;AudiomackSearchResults&gt;(`/music/${genre}/recent/page/${page}`);

}, getGenreTrending(genre: string, page = 1) { return

audiomackFetch&lt;t;AudiomackSearchResults&gt;(`/music/${genre}/trending/page/${page}`);

}, getStreamingUrl(id: string, session?: string) { const params: Record&lt;t;string,

string&gt; = {}; if (session) params.session = session; return

audiomackFetch&lt;t;string&gt;(`/music/${id}/play`, { method: 'POST', params,

revalidate: 0 }); }, favorite(id: string, token: { key: string; secret: string }) {

return audiomackFetch&lt;t;void&gt;(`/music/${id}/favorite`, { method: 'PUT',

authenticated: true, token }); }, unfavorite(id: string, token: { key: string; secret:

string }) { return audiomackFetch&lt;t;void&gt;(`/music/${id}/favorite`, { method:

'DELETE', authenticated: true, token }); }, }; // --- Artist API Methods --- export

const artistApi = { getInfo(slug: string) { return audiomackFetch&lt;t;{ results:

AudiomackArtist }&gt;(`/artist/${slug}`); }, getUploads(slug: string, page = 1) {

```

```javascript

return audiomackFetch&lt; AudiomackSearchResults&gt; (

/* artist/${slug}/uploads/page/${page}` ); }, getPlaylists(slug: string, genre?: string)

{ const params: Record&lt; string, string&gt; = {}; if (genre) params.genre = genre;

return audiomackFetch&lt; { results: AudiomackPlaylist[] }&gt; (

/* artist/${slug}/playlists`, { params } ); }, getFollowing(slug: string) { return

audiomackFetch&lt; { results: AudiomackArtist[] }&gt; ( `/artist/${slug}/following` ); },

}; // --- Search API Methods --- export const searchApi = { search(query: string,

autosuggest = false) { const params: Record&lt; string, string&gt; = { q: query, }; if

(autosuggest) params.autosuggest = 'true'; return

audiomackFetch&lt; AudiomackSearchResults&gt; ( `/search/all`, { params, revalidate: 0 }

); }, };

```

## 5.4 Audio Player Component

The audio player is the most critical component of any music streaming application. It must handle seamless track transitions, manage playback state across page navigations, and properly manage the time-limited streaming URLs provided by the Audiomack API. The following implementation uses Zustand for state management and the HTML5 Audio API through Howler.js for cross-browser compatibility. The player persists across route changes by being mounted in the root layout, and the Zustand store ensures that playback state is maintained even when the user navigates between pages.

## Playback State Store (Zustand)

```javascript

// src/lib/audi o/store.ts import { create } from 'zustand'; import type {

Audi o mackMusic } from '@lib/audi o mack/types'; interface PlayerState { currentTrack:

Audi o mackMusic | null; queue: Audi o mackMusic[]; queueIndex: number; isPlaying: boolean;

isLoading: boolean; currentTime: number; duration: number; volume: number; shuffle:

boolean; repeat: 'off' | 'one' | 'all'; // Actions set Track: (track: Audi o mackMusic)

=&gt; void; setQueue: (tracks: Audi o mackMusic[], startIndex?: number) =&gt; void; play:

() =&gt; void; pause: () =&gt; void; next: () =&gt; void; previous: () =&gt; void;

setCurrentTime: (time: number) =&gt; void; setDuration: (duration: number) =&gt; void;

setVolume: (volume: number) =&gt; void; toggleShuffle: () =&gt; void; toggleRepeat: ()

=&gt; void; setLoading: (loading: boolean) =&gt; void; } export const usePlayerStore = create&lt; PlayerState&gt;((set, get) =&gt; ({ currentTrack: null, queue: [],

queueIndex: 0, isPlaying: false, isLoading: false, currentTime: 0, duration: 0, volume:

0.8, shuffle: false, repeat: 'off', setTrack: (track) =&gt; set({ currentTrack: track,

isLoading: true }), setQueue: (tracks, startIndex = 0) =&gt; set({ queue: tracks,

queueIndex: startIndex }), play: () =&gt; set({ isPlaying: true }), pause: () =&gt;

set({ isPlaying: false }), setLoading: (loading) =&gt; set({ isLoading: loading }),

setCurrentTime: (time) =&gt; set({ currentTime: time }), setDuration: (duration) =&gt;

set({ duration }), setVolume: (volume) =&gt; set({ volume }), toggleShuffle: () =&gt;

set((s) =&gt; ({ shuffle: !s.shuffle })), toggleRepeat: () =&gt; set((s) =&gt; ({

repeat: s.repeat === 'off' ? 'all' : s.repeat === 'all' ? 'one' : 'off', }))), next: ()

=&gt; { const { queue, queueIndex, shuffle } = get(); if (queue.length === 0) return;

let nextIndex: number; if (shuffle) { nextIndex = Math.floor(Math.random() *

queue.length); } else { nextIndex = (queueIndex + 1) % queue.length; } set({ queueIndex:

nextIndex, currentTrack: queue[nextIndex], isLoading: true, currentTime: 0, }); },

previous: () =&gt; { const { queue, queueIndex } = get(); if (queue.length === 0)

return; const prevIndex = queueIndex === 0 ? queue.length - 1 : queueIndex - 1; set({

queueIndex: prevIndex, currentTrack: queue[prevIndex], isLoading: true, currentTime: 0,

}); }, });

```

## Audio Player Component

// src/ component s/audi o/Audi oPlayer.tsx 'use client'; import { useEffect, useRef, useCallback } from 'react'; import { How } from 'howler'; import { usePlayerStore } from '@lib/audi o/store'; import PlayerControls from './PlayerControls'; import ProgressBar from './ProgressBar'; import VolumeControl from './VolumeControl'; // Track ending handler function useTrackEnding(howRef: React.MutableRefObject&lt;How|null&gt;) { const { next, repeat, queue } = usePlayerStore(); useEffect(() =>&gt; { const how = howRef.current; if (!how) return; how.on('end', () =>&gt; { if (repeat === 'one') { how.seek(0); how.play(); } else if (repeat === 'all' || queue.length &gt; 0) { next(); } }); }, [repeat, queue.length, next, howRef]); } export default function Audi oPlayer() { const howRef = useRef&lt;How|null&gt;(null); const { currentTrack, isPlaying, isLoading, volume, play, pause, setCurrentTime, setDuration, setLoading, } =

usePlayerStore(); // Fetch streaming URL when track changes const fetchStreamUrl = useCallback(async (trackId: string) =&gt; { setLoading(true); try { const res = await fetch(`/api/audiomack/music/play?id=${trackId}`); if (!res.ok) throw new Error('Failed to get stream URL'); const url = await res.json(); return url; } catch (error) {

console.error('Stream fetch error:', error); return null; } }, [setLoading]); // Play/pause toggle const togglePlayback = useCallback(() =&gt; { if (!howRef.current) return; if (isPlaying) { howRef.current.pause(); pause(); } else {

howRef.current.play(); play(); } }, [isPlaying, play, pause]); // Handle track changes useEffect(() =&gt; { if (!currentTrack) return; // Stop previous track if (howRef.current) { howRef.current.unload(); howRef.current = null; } (async () =&gt; { const streamUrl = await fetchStreamUrl(currentTrack.id); if (!streamUrl) {

setLoading(false); return; } const how = new How({ src: [streamUrl], html5: true, // Enable for streaming volume: volume, onload: () =&gt; setLoading(false), onloaderror: () =&gt; setLoading(false), }); howRef.current = how; how.play(); play(); })(); }, [currentTrack]); // Intentionally limited deps // Update volume useEffect(() =&gt; { if (howRef.current) { howRef.current.volume(volume); } }, [volume]); useTrackEnding(howRef); if (!currentTrack) return null; return ( &lt; div className="fixed bottom 0 left-0 right-0 bg-gray-900 border-t border-gray-700 z-50" &gt; &lt; ProgressBar howRef={howRef} /&gt; &lt; div className="flex items-center justify-between px-4 py-3" &gt; &lt; TrackInfo track={currentTrack} /&gt; &lt; PlayerControls isPlaying={isPlaying} isLoading={isLoading} onToggle={togglePlayback} /&gt; &lt; VolumeControl /&gt; &lt; /div&gt; &lt; /div&gt; ); }

## 5.5 Key UI Pages and Components

This section provides implementation patterns for the key UI pages in the music streaming application. Each page leverages Next.js Server Components for initial data fetching and Client Components for interactive elements. The patterns demonstrate best practices for integrating with the Audiomack API while maintaining responsive design and smooth user experiences.

## Homepage: Trending and Recent Music

The homepage serves as the primary entry point, displaying trending and recently uploaded music in an engaging grid layout. Using Server Components, the data is fetched at the server level, reducing client-side JavaScript and improving initial load performance. The page uses Next.js built-in caching with revalidation to serve fresh content while minimizing API calls.

```javascript

// src/app/page.tsx (Server Component) import { musicApi } from

'@lib/audiomack/client'; import MusicGrid from '@components/music/MusicGrid'; import

GenrePill from '@components/music/GenrePill'; const GENRES = ['all', 'rap',

'electronic', 'r-b', 'pop']; export default async function HomePage() { const

[trending, recent] = await Promise.all([ musicApi.getTrending(1),

musicApi.getRecent(1), ]); return ( &lt; main className="min-h-screen pb-24"&gt;

&lt; section className="px-6 pt-8"&gt; &lt; h1 className="text-3xl font-bold

mb-6"&gt; Discover Music&lt;/h1&gt; &lt; div className="flex gap-2 mb-6

overflow-x-auto"&gt; { GENRES.map((genre) =&gt; ( &lt; GenrePill key={genre}

genre={genre} /&gt; )) } &lt;/div&gt; &lt;/section&gt; &lt; section className="px-6

mb-8"&gt; &lt; h2 className="text-xl font-semi bold mb-4"&gt; Trending Now&lt;/h2&gt;

&lt; MusicGrid tracks={trending.results} /&gt; &lt;/section&gt; &lt; section

className="px-6"&gt; &lt; h2 className="text-xl font-semi bold mb-4"&gt; New

Releases&lt;/h2&gt; &lt; MusicGrid tracks={recent.results} /&gt; &lt;/section&gt;

&lt;/main&gt; ); }

```

## Track Card Component

The TrackCard component is the building block for music grids and lists throughout the application. It displays album artwork, track title, artist name, and provides play/favorite interactions. The component uses Next.js Image component for optimized artwork loading with lazy loading and blur placeholders.

```javascript

// src/ component s/ musi c/ TrackCard. tsx 'use client'; import Image from 'next/ image';

import { usePlayerStore } from '@lib/audi o/ store'; import type { Audi o mackMusic } from '@lib/audi o mack/types'; interface TrackCardProps { track: Audi o mackMusic; tracks?: Audi o mackMusic[]; // for queue context } export default function TrackCard({ track, tracks }: TrackCardProps) { const { setTrack, setQueue, play } = usePlayerStore(); const handlePlay = () =&gt; { if (tracks) { const index = tracks.findIndex((t) =&gt; t.id === track.id); setQueue(tracks, index); } setTrack(track); }; return ( &lt; button onClick={handlePlay} className="group bg-white rounded-lg overflow-hidden shadow hover: shadow-md transition w-full text-left" &gt; &lt; div className="relative aspect-square" &gt; &lt; Image src={track.image} alt={track.title} fill className="object-cover" sizes="( max-width: 640px) 50vw, ( max-width: 1024px) 33vw, 20vw" /&gt; &lt; div className="absolute inset-0 bg-black/40 opacity-0 group-hover: opacity-100 flex items-center justify-center transition-opacity" &gt; &lt; PlayIcon className="w-12 h-12 text-white" /&gt; &lt; /div&gt; &lt; /div&gt; &lt; div className="p-3" &gt; &lt; h3 className="font-semi bold text-sm truncate" &gt; {track.title} &lt; /h3&gt; &lt; p className="text-gray-500 text-xs truncate" &gt; {track. artist}

```

&l t; / p&gt; &l t; / di v&gt; &l t; / but t on&gt; ); }

## Search with Debounced Autosuggest

The search component implements real-time autosuggest with debouncing to provide a responsive search experience without overwhelming the API. The debounce delay of 300ms prevents excessive requests during rapid typing while maintaining perceived responsiveness. Results are displayed in a dropdown format below the search input, with each result clickable to navigate to the corresponding detail page.

```javascript

// src/components/search/SearchBar.tsx 'use client'; import { useState, useEffect,

useRef, useCallback } from 'react'; import { useRouter } from 'next/navigation'; import

debounce from 'lodash.debounce'; interface SearchResult { id: string; title: string;

artist: string; image: string; type: 'song' | 'album'; } export default function

SearchBar() { const [query, setQuery] = useState(''); const [results, setResults] =

useState(&t; SearchResult[] &gt; ([]); const [isOpen, setIsOpen] = useState(false); const

inputRef = useRef(&t; HTMLInputElement &gt; (null); const router = useRouter(); const

debouncedSearch = useCallback( debounce(async (q: string) =&gt; { if (q.length &lt; 2) {

setResults([]); return; } try { const res = await fetch(

`/api/audiomack/search?q=${encodeURIComponent(q)}&amp;autosuggest=true` ); const data =

await res.json(); setResults(data.results?.slice(0, 8) || []); setIsOpen(true); } catch

(error) { console.error('Search error:', error); } }, 300), [] ); useEffect(() =&gt; {

debouncedSearch(query); return () =&gt; debouncedSearch.cancel(); }, [query]); return (

&t; div className="relative" &gt; &t; input ref={inputRef} type="text" value={query}

onChange={(e) =&gt; setQuery(e.target.value)} placeholder="Search artists, songs,

albums..." className="w-full bg-gray-800 text-white rounded-full px-4 py-2 pl-10

focus: outline-none focus: ring-2 focus: ring-blue-500" /&gt; {isOpen &amp; &amp;

results.length &gt; 0 &amp; &amp; ( &t; div className="absolute top-full mt-1 w-full

bg-gray-800 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50" &gt;

{results.map((result) =&gt; ( &t; button key={result.id} onClick={() =&gt; {

router.push(`/music/${result.id}`); setIsOpen(false); }} className="flex items-center

gap-3 w-full px-4 py-2 hover: bg-gray-700" &gt; &t; img src={result.image}

className="w-8 h-8 rounded" /&gt; &t; div &gt; &t; p className="text-sm font-medium

text-white" &gt; {result.title} &t;/p&gt; &t; p className="text-xs text-gray-400" &gt;

{result.artist} &t;/p&gt; &t;/div&gt; &t;/button&gt; })} &t;/div&gt; )}

&t;/div&gt; ); }

```

## 5.6 State Management for Playback

Effective state management for audio playback requires handling several complex interactions: track changes must trigger streaming URL fetches, playback state must persist across page navigations, and the play queue must be maintainable from any page. The Zustand store defined in Section 5.4 provides the central source of truth for all playback state. The AudioPlayer component, mounted in the root layout, subscribes to store changes and manages the actual Howler.js audio instance. Other components dispatch actions to the store without directly interacting with the audio engine.

A critical consideration is that the streaming URLs from the Audiomack API expire within approximately 10 seconds. Therefore, the streaming URL must be fetched immediately before playback begins, not cached for future use. The AudioPlayer component handles this by calling the play API endpoint (proxied through the Next.js API route) whenever the currentTrack changes in the store. This ensures that each play action receives a fresh, valid streaming URL. For queued playback, when the current track ends and the next track begins, the

component automatically fetches a new streaming URL for the next track before starting playback. This architecture decouples the queue management from the streaming URL lifecycle, simplifying the overall state management.

For the root layout integration, mount the AudioPlayer component at the layout level to ensure it persists across all route changes. The PlayerProvider wraps the application and provides global access to playback controls from any component in the tree. This approach avoids prop drilling and enables features like the mini-player in the bottom bar while maintaining a single audio instance across the entire application.

```javascript

// src/ app/ layout.tsx (relevant portion) import Audi oPl ayer from

' @components/ audi o/ Audi oPl ayer'; import { Pl ayer Provi der } from

' @providers/ Pl ayer Provi der'; export default function Root Layout({ chil dr en }) { return

( &lt; html lang="en" &gt; &lt; t; body&gt; &lt; t; Pl ayer Provi der &gt; { chil dr en} &lt; t; Audi oPl ayer

/ &gt; &lt; t; / Pl ayer Provi der &gt; &lt; t; / body&gt; &lt; t; / ht m &gt; ); }

```

## 6. Advanced Topics

## 6.1 Streaming URL Lifecycle Management

One of the most critical aspects of integrating with the Audiomack API is properly managing the lifecycle of streaming URLs. Unlike static media URLs that remain valid indefinitely, the Audiomack streaming URLs are pre-signed with a CloudFront expiration timestamp, making them valid for only approximately 10 seconds. This design prevents unauthorized redistribution of streaming links but requires careful handling in the client application.

The recommended approach is to implement a "just-in-time" streaming URL fetch strategy. Instead of storing the streaming URL returned by the song info endpoint, always use the dedicated play endpoint (POST /v1/ musi c/:i d/ play) to obtain a fresh streaming URL immediately before playback begins. The play endpoint also accepts optional parameters like hq for high-quality audio, session for tracking, and album id or playlist id for contextual information.

In practice, the AudioPlayer component should fetch the streaming URL from the server-side API route each time a new track is selected. The API route proxies the request to Audiomack, signs it with the OAuth credentials, and returns the streaming URL to the client. The client then passes this URL to Howler.js for playback. If the user seeks to a position in the track after the URL has expired, the player should transparently fetch a new URL and resume playback from the current position. Implement a retry mechanism (up to 3 attempts with exponential backoff) to handle transient network issues during URL fetching.

## Streaming URL Fetch API Route

```javascript

// src/app/api/audiomack/music/play/route.ts import { NextRequest, NextResponse } from 'next/server'; import { signRequest, toHeader } from '@lib/audiomack/oauth'; const BASE_URL = process.env.AUDIOMACK_BASE_URL!; export async function POST(request: NextRequest) { try { const { id, session, hq, playlistId } = await request.json(); const params = new URLSearchParams(); if (session) params.set('session', session); if (hq) params.set('hq', 'true'); if (playlistId) params.set('playlist_id', playlistId); const url = `${BASE_URL}/music/${id}/play?${params}`; const authData = signRequest('POST', url); const header = toHeader(authData); const res = await fetch(url, { method: 'POST', headers: header, cache: 'no-store', // Never cache streaming URLs }); if (!res.ok) { return NextResponse.json( { error: 'Failed to get streaming URL' }, { status: res.status } ); } const streamUrl = await res.text(); return NextResponse.json(streamUrl); } catch (error) { return NextResponse.json( { error: 'Internal server error' }, { status: 500 } ); } }

```

## 6.2 Caching and Performance

Effective caching is essential for building a responsive music streaming application. The Audiomack API supports Next.js's built-in caching mechanisms through the fetch API's next.revalidate option. This enables time-based revalidation where responses are served from the cache and revalidated in the background after a specified period. The following caching strategy is recommended for different types of API data, balancing freshness requirements with API rate limits and response latency.

<table border="1"><tr><td>Data Type</td><td>Cache Duration</td><td>Rationale</td></tr><tr><td>Trending music</td><td>5 minutes</td><td>Trending lists change gradually; stale data acceptable</td></tr><tr><td>Recent uploads</td><td>2 minutes</td><td>Recent uploads are time-sensitive; shorter cache</td></tr><tr><td>Artist profiles</td><td>1 hour</td><td>Profile data changes infrequently</td></tr><tr><td>Artist uploads</td><td>10 minutes</td><td>Upload lists change moderately</td></tr><tr><td>Playlist info</td><td>15 minutes</td><td>Playlist metadata is relatively stable</td></tr><tr><td>Search results</td><td>No cache</td><td>Search queries are unique; never cache</td></tr><tr><td>Streaming URLs</td><td>No cache</td><td>URLs expire in ~10 seconds; must not cache</td></tr><tr><td>Chart data</td><td>30 minutes</td><td>Charts are updated periodically</td></tr><tr><td>Genre lists</td><td>1 hour</td><td>Genre taxonomies rarely change</td></tr></table>

For additional performance optimization, implement route-level caching in Next.js API routes using the Route Handler cache. Server-side caching with a tool like Redis can further reduce redundant API calls. When using Redis, cache API responses with a TTL matching the revalidation period, and use the API endpoint path as the cache key. Implement cache invalidation when the user performs write operations (favoriting, following) to ensure UI consistency.

## 6.3 Rate Limiting and Error Resilience

Although the Audiomack API documentation does not explicitly publish rate limits, implementing client-side rate limiting is a best practice to prevent abuse and ensure reliable operation. Implement rate limiting at the Next.js API route level using middleware or a library like rate-limiter-flexible. A recommended starting point is 60 requests per minute per IP address for public endpoints and 120 requests per minute per authenticated user for protected endpoints. Implement exponential backoff with jitter for retry logic to handle transient server errors (5XX responses) gracefully without overwhelming the API.

Error resilience should be implemented at multiple levels. At the API route level, wrap all Audiomack API calls in try-catch blocks and return appropriate error responses to the client. At the component level, use React Error Boundaries to gracefully handle rendering errors. For audio playback errors, implement automatic retry (up to 3 attempts) when a streaming URL fails to load, and skip to the next track after exhausting retries. For network failures, display a friendly error message with a retry button rather than crashing the application. Monitor error rates and alert when error rates exceed threshold values to proactively detect API issues.

// Retry utility with exponential backoff async function fetchWithRetry&lt; T&gt; ( fn: () =&gt; Promise&lt; T&gt; , maxRetries = 3, baseDelay = 1000 ): Promise&lt; T&gt; { for (let attempt = 0; attempt &lt; = maxRetries; attempt ++) { try { return await fn(); } catch (error) { if (attempt === maxRetries) throw error; const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 500; await new Promise(r =&gt; set Timeout(r, delay)); } } throw new Error(' Max retries exceeded'); }

## 6.4 Metrics and Analytics Integration

The Audiomack API provides a stats system for tracking playback events, which helps the platform understand content popularity and provides analytics data to artists. To properly integrate stats tracking, first obtain a stats token using GET /v1/stat s/token, then record playback events using POST /v1/stat s/record. The play endpoint's session parameter should be used consistently across all stats-related requests to maintain accurate tracking.

The music metrics endpoint （GET /v1/music/:id/metrics）provides real-time engagement data including play counts and repost counts, aggregated over the last 60 minutes. This data can be used to display live engagement indicators on track detail pages, such as "345 plays in the last hour." The artist metrics endpoint （GET /v1/artist/:id/metrics）provides aggregate metrics for an artist and their top 10 music items. Integrating these metrics into the UI provides users with a sense of content popularity and activity, enhancing the discovery experience.

## 7. Limitations and Considerations

While the Audiomack API provides a comprehensive set of features for building music streaming applications, developers should be aware of several limitations and considerations that may impact the design and functionality of their application. Understanding these constraints upfront allows for informed architectural decisions and proper expectation management with stakeholders.

## OAuth 1.0a Complexity

The use of OAuth 1.0a rather than the more modern OAuth 2.0 adds implementation complexity, particularly around request signing. Every API request (including public endpoints) must be signed with the consumer key and secret using HMAC-SHA1. This means that all API communication must be proxied through server-side routes, as the consumer secret cannot be exposed to the browser. The three-legged flow for user authorization also involves multiple redirects and token exchanges, which requires careful state management during the authentication process. However, pre-built OAuth 1.0a libraries for most programming languages significantly reduce this complexity, and the Audiomack team provides example implementations in PHP on their GitHub repository [5].

## Streaming URL Expiration

The 10-second expiration window for streaming URLs is the most significant technical constraint in the application architecture. It precludes traditional audio preloading and buffering strategies where multiple tracks might be pre-fetched simultaneously. Each track must individually request a streaming URL just before playback begins. For gapless playback between tracks in a queue, the application must fetch the next track's streaming URL immediately after the current track begins playing, then preload the audio while the current track is still active. This requires careful timing and error handling to ensure seamless transitions without audible gaps or stutters.

## No WebSocket or Push Notifications

The Audiomack API is purely request-response based and does not provide WebSocket connections or push notification capabilities for real-time updates. Features such as live follower count updates, real-time notification delivery, or collaborative playlist editing cannot be implemented directly through the API. For real-time features, developers would need to implement polling mechanisms (periodically checking for new notifications or updated metrics) or supplement the API with a custom WebSocket server that aggregates and pushes data to clients.

## Limited Genre Support

The API documentation explicitly lists only a few genres for filtering endpoints (notably rap and electronic). The available genre values may be limited compared to the full taxonomy shown on the Audiomack website. Developers should verify the complete list of supported genre values by testing the API endpoints or contacting the Audiomack developer relations team. The music entity's genre field may contain values not directly usable as API path parameters, requiring a mapping layer between the UI's genre taxonomy and the API's supported values.

## No Upload API

The current version of the Audiomack API does not provide endpoints for uploading music content. Artists who wish to upload new tracks must use the Audiomack website directly. This means the music streaming application is primarily a consumption and discovery platform, not a content creation tool. If upload functionality is required, it would need to be implemented through web scraping or other unofficial means, which may violate Audiomack's terms of service and is not recommended for production applications.

## Token Expiration and Re-Authorization

Access tokens expire after one year, requiring periodic re-authorization. The application must implement a mechanism to detect expired tokens (HTTP 401 with error code 1003) and redirect the user to the OAuth authorization flow. The application should store the token expiration timestamp alongside the token and proactively trigger re-authorization before expiration, rather than waiting for an API call to fail. Implement a token refresh check in the middleware that runs before authenticated API calls, automatically initiating re-authorization when the token is within 30 days of expiration.

## 8. Conclusion and Future Outlook

This technical documentation has provided a comprehensive guide for building a music streaming web application using Next.js 15 and the Audiomack Data API. The guide covered the complete development lifecycle, from understanding the API structure and authentication mechanisms, through architectural design and project structure, to implementing core features with production-ready code patterns. The Audiomack API offers a rich set of endpoints for music discovery, playback, artist management, playlist operations, search, and user engagement, making it a viable foundation for building compelling music streaming experiences.

The key architectural decisions presented in this guide, including the server-side API proxy pattern for OAuth security, the just-in-time streaming URL fetch strategy, and the Zustand-based audio state management approach, address the unique challenges of integrating with the Audiomack platform while maintaining a modern, responsive user interface. The caching strategy balances data freshness with API efficiency, and the error resilience patterns ensure reliable operation under adverse conditions.

Looking ahead, several enhancements could further improve the application. Integrating a database (e.g., PostgreSQL with Prisma) would enable offline access to cached music metadata, persistent user preferences, and local playlist management that syncs with Audiomack. Implementing a recommendation engine based on user listening history and genre preferences could enhance the discovery experience. Adding social features like collaborative playlists, comments, and sharing would increase user engagement. Progressive Web App (PWA) support with background sync and offline playback would enable mobile users to enjoy music without a constant internet connection. Finally, integrating the real-time metrics API into dashboards for both users and artists could provide valuable insights into content performance and listening habits.

As the Audiomack platform continues to evolve, developers should monitor the official API changelog for new endpoints, modified authentication flows, and updated rate limits. The modular architecture described in this guide is designed to accommodate such changes with minimal refactoring, ensuring that the application remains maintainable and adaptable to future platform enhancements.

## 9. References

[1] Audiomack, "Audiomack API Documentation," audiomack.com. [Online]. Available: https://audiomack.com/data-api/docs. [Accessed: April 3, 2026].

[2] PublicAPI.dev, "Audiomack API," publicapi.dev. [Online]. Available: https://publicapi.dev/audiomack-api. [Accessed: April 3, 2026].

[3] Vercel, "Next.js Documentation - App Router," nextjs.org. [Online]. Available: https://nextjs.org/docs/app. [Accessed: April 3, 2026].

[4] A. Ali, "Building an Audio Player App with Next.js," Medium. [Online]. Available:

https://asharibali.medium.com/building-an-audio-player-app-with-next-js-80d06cc1d7d8. [Accessed: April 3, 2026].

[5] Audiomack, "Audiomack API Examples," GitHub. [Online]. Available: https://github.com/audiomack/audiomack-api-examples. [Accessed: A

[6] MusicAPI.com, "Audiomack API: Get User Info, Email & Profile Picture," musicapi.com. [Online]. Available: https://musicapi.com/get-user-profile/audiomack. [Accessed: April 3, 2026].

[7] Musicfetch, "Does Audiomack have an API?," musicfetch.io. [Online]. Available https://musicfetch.io/services/audiomack/api. [Accessed: April 3, 2026].

[8] FreeAPIsForYou, "Audiomack API - Free Music API," freeapisforyou.in. [Online]. Available: https://www.freeapisforyou.in/api/audiomack. [Accessed: April 3, 2026].

[9] OAuth.net, "OAuth 1.0a Specification," oauth.net. [Online]. Available: https://oauth.net/core/1.0a/. [Accessed: April 3, 2026].

[10] Vercel, "Next.js 15 Release Notes," nextjs.org. [Online]. Available: https://nextjs.org/blog. [Accessed: April 3, 2026].