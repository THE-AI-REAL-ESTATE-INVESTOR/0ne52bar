#!/bin/bash
# Facebook access token utility using curl

# Load environment variables from .env.local
if [ -f .env.local ]; then
  export $(grep -v '^#' .env.local | xargs)
elif [ -f ../../../.env.local ]; then
  export $(grep -v '^#' ../../../.env.local | xargs)
fi

# Check if APP_ID is available
if [ -z "$FACEBOOK_APP_ID" ]; then
  echo "Error: FACEBOOK_APP_ID is not set in .env.local"
  exit 1
fi

# Check if PAGE_ID is available
if [ -z "$FACEBOOK_PAGE_ID" ]; then
  echo "Error: FACEBOOK_PAGE_ID is not set in .env.local"
  exit 1
fi

# Function to print help message
print_help() {
  echo "Facebook Token Utility"
  echo "====================="
  echo "Usage: ./facebook-curl.sh [command]"
  echo ""
  echo "Commands:"
  echo "  check       - Check if current token is valid"
  echo "  debug       - Debug the current token"
  echo "  exchange    - Exchange a short-lived token for a long-lived token"
  echo "  page        - Get a page access token from user access token"
  echo "  events      - List events from your Facebook page"
  echo ""
  echo "For oauth URL: ./facebook-curl.sh oauth"
  echo ""
}

# Check if current token is valid
check_token() {
  echo "Checking if token is valid..."
  
  RESPONSE=$(curl -s "https://graph.facebook.com/v22.0/me?access_token=$FACEBOOK_ACCESS_TOKEN")
  
  if [[ $RESPONSE == *"error"* ]]; then
    echo "❌ Token is invalid or expired!"
    echo "Error details: $RESPONSE"
    echo ""
    echo "Try getting a new token with: ./facebook-curl.sh oauth"
    return 1
  else
    echo "✅ Token is valid! Connected to:"
    echo "$RESPONSE"
    return 0
  fi
}

# Debug a token
debug_token() {
  if [ -z "$FACEBOOK_APP_SECRET" ]; then
    echo "⚠️ Warning: FACEBOOK_APP_SECRET not found in .env.local"
    echo "Token debugging requires APP_SECRET for app authentication"
    echo "Add FACEBOOK_APP_SECRET to your .env.local file"
    echo ""
    echo "Attempting to debug token without app authentication..."
    
    # Try debugging without app authentication
    RESPONSE=$(curl -s "https://graph.facebook.com/debug_token?input_token=$FACEBOOK_ACCESS_TOKEN&access_token=$FACEBOOK_ACCESS_TOKEN")
  else
    # Use app authentication
    RESPONSE=$(curl -s "https://graph.facebook.com/debug_token?input_token=$FACEBOOK_ACCESS_TOKEN&access_token=${FACEBOOK_APP_ID}|${FACEBOOK_APP_SECRET}")
  fi
  
  echo "Token debug information:"
  echo "$RESPONSE" | python -m json.tool
}

# Print OAuth URL for browser authentication
oauth_url() {
  SCOPES="pages_show_list,pages_read_engagement,public_profile"
  REDIRECT_URI="https://developers.facebook.com/tools/explorer/callback"
  
  echo "OAuth URL for browser authentication:"
  echo "https://www.facebook.com/v22.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}&response_type=token"
  echo ""
  echo "Instructions:"
  echo "1. Copy and paste the URL above into your browser"
  echo "2. Authorize the app and permissions"
  echo "3. After authorization, you'll be redirected"
  echo "4. Copy the access_token value from the URL in your browser"
  echo "5. Update your .env.local file with this new token"
  echo ""
  echo "ALTERNATIVE METHOD (RECOMMENDED):"
  echo "1. Go to https://developers.facebook.com/tools/explorer/"
  echo "2. Select your app '${FACEBOOK_APP_ID}' from the dropdown"
  echo "3. Click 'Add a Permission' and add these permissions:"
  echo "   - pages_show_list"
  echo "   - pages_read_engagement"
  echo "4. Click 'Generate Access Token'"
  echo "5. Copy the generated token and use it to update your .env.local file"
  echo ""
  echo "Note: If your app is in development mode, you might only be able"
  echo "to access pages where you are an admin."
}

# Exchange short-lived token for a long-lived token
exchange_token() {
  if [ -z "$FACEBOOK_APP_SECRET" ]; then
    echo "Error: FACEBOOK_APP_SECRET not found in .env.local"
    echo "Exchange token requires APP_SECRET for app authentication"
    echo "Add FACEBOOK_APP_SECRET to your .env.local file"
    return 1
  fi
  
  echo "Exchanging short-lived token for a long-lived token..."
  
  RESPONSE=$(curl -s \
    -d "grant_type=fb_exchange_token" \
    -d "client_id=${FACEBOOK_APP_ID}" \
    -d "client_secret=${FACEBOOK_APP_SECRET}" \
    -d "fb_exchange_token=${FACEBOOK_ACCESS_TOKEN}" \
    "https://graph.facebook.com/v22.0/oauth/access_token")
  
  if [[ $RESPONSE == *"error"* ]]; then
    echo "❌ Token exchange failed!"
    echo "Error details: $RESPONSE"
    return 1
  else
    NEW_TOKEN=$(echo $RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
    EXPIRES_IN=$(echo $RESPONSE | grep -o '"expires_in":[0-9]*' | cut -d':' -f2)
    
    echo "✅ Successfully exchanged token!"
    echo "Expires in: $EXPIRES_IN seconds (approximately $(($EXPIRES_IN / 86400)) days)"
    echo ""
    echo "New long-lived token:"
    echo "$NEW_TOKEN"
    
    read -p "Do you want to update your .env.local file with this token? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      # Update .env.local
      if [ -f .env.local ]; then
        sed -i '' "s/FACEBOOK_ACCESS_TOKEN=.*/FACEBOOK_ACCESS_TOKEN=${NEW_TOKEN}/" .env.local
      elif [ -f ../../../.env.local ]; then
        sed -i '' "s/FACEBOOK_ACCESS_TOKEN=.*/FACEBOOK_ACCESS_TOKEN=${NEW_TOKEN}/" ../../../.env.local
      fi
      echo "✅ .env.local updated with new token"
    fi
  fi
}

# Get a page access token
get_page_token() {
  echo "Getting page access token for page ID: ${FACEBOOK_PAGE_ID}..."
  
  RESPONSE=$(curl -s "https://graph.facebook.com/v22.0/${FACEBOOK_PAGE_ID}?fields=access_token&access_token=${FACEBOOK_ACCESS_TOKEN}")
  
  if [[ $RESPONSE == *"error"* ]]; then
    echo "❌ Failed to get page access token!"
    echo "Error details: $RESPONSE"
    return 1
  else
    PAGE_TOKEN=$(echo $RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
    
    if [ -z "$PAGE_TOKEN" ]; then
      echo "❌ No page access token found in response"
      echo "Response: $RESPONSE"
      return 1
    else
      echo "✅ Successfully retrieved page access token!"
      echo ""
      echo "Page access token:"
      echo "$PAGE_TOKEN"
      
      read -p "Do you want to update your .env.local file with this token? (y/n) " -n 1 -r
      echo ""
      if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Update .env.local
        if [ -f .env.local ]; then
          sed -i '' "s/FACEBOOK_ACCESS_TOKEN=.*/FACEBOOK_ACCESS_TOKEN=${PAGE_TOKEN}/" .env.local
        elif [ -f ../../../.env.local ]; then
          sed -i '' "s/FACEBOOK_ACCESS_TOKEN=.*/FACEBOOK_ACCESS_TOKEN=${PAGE_TOKEN}/" ../../../.env.local
        fi
        echo "✅ .env.local updated with page access token"
      fi
    fi
  fi
}

# List events from the page
list_events() {
  echo "Fetching events from page ID: ${FACEBOOK_PAGE_ID}..."
  
  RESPONSE=$(curl -s "https://graph.facebook.com/v22.0/${FACEBOOK_PAGE_ID}/events?fields=name,description,start_time,end_time&access_token=${FACEBOOK_ACCESS_TOKEN}")
  
  if [[ $RESPONSE == *"error"* ]]; then
    echo "❌ Failed to get events!"
    echo "Error details: $RESPONSE"
    return 1
  else
    echo "✅ Events from Facebook page:"
    echo "$RESPONSE" | python -m json.tool
  fi
}

# Process command
if [ $# -eq 0 ]; then
  print_help
else
  case "$1" in
    "check")
      check_token
      ;;
    "debug")
      debug_token
      ;;
    "oauth")
      oauth_url
      ;;
    "exchange")
      exchange_token
      ;;
    "page")
      get_page_token
      ;;
    "events")
      list_events
      ;;
    "help")
      print_help
      ;;
    *)
      echo "Unknown command: $1"
      print_help
      exit 1
      ;;
  esac
fi 