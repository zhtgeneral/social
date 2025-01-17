import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { HomeView } from '../../../../app/(main)/home';

const mockUser = {
  name: "Mock user",
  email: "Mock email",
  image: "uploads/profiles/1732333173502.png",
  phone: "Mock phone",
  bio: "Mock bio",
  address: "Mock location"
}
const mockPoster1 = {
  name: "Mock user",
  email: "Mock email",
  image: "uploads/profiles/1732333390827.png",
  phone: "Mock phone",
  bio: "Mock bio",
  address: "Mock location"
}
const mockPoster2 = {
  name: "Mock user",
  email: "Mock email",
  image: "uploads/profiles/1732333540825.png",
  phone: "Mock phone",
  bio: "Mock bio",
  address: "Mock location"
}
const mockPoster3 = {
  name: "Mock user",
  email: "Mock email",
  image: "uploads/profiles/1734484212945.png",
  phone: "Mock phone",
  bio: "Mock bio",
  address: "Mock location"
}

/** @Note if updating users from database, this user id has to exist for tests to work */
const existingUserId = "b3bee4e8-f5fb-4822-91ef-5f7f1dcdffa2"

const mockPostNoComments = [
  {
    body: "<p>I am a post with no comments</p>",
    created_at: "2025-01-05 03:45:32.833949+00",
    file: null,
    id: "noCommentId",
    user_id: existingUserId,
    user: mockUser,
    comments: [{
      count: 0
    }]
  }
]
const mockSinglePostManyComments = [
  {
    body: "<div>I am a post with many many comments</div>",
    created_at: "2025-01-05 03:45:32.833949+00",
    file: null,
    id: "manyCommentId",
    user_id: existingUserId,
    user: mockUser,
    comments: [{
      count: 999999999999999
    }]
  }
]
const mockPostNoUser = [
  {
    body: "<div>I am a post with no user</div>",
    created_at: "2025-01-05 03:45:32.833949+00",
    file: null,
    id: "noUserId",
    user_id: null,
    user: {},
    comments: [{
      count: 0
    }]
  }
]
const mockManyPosts = [
  {
    body: "<div>I am the first post</div>",
    created_at: "2025-01-05 03:45:32.833949+00",
    file: null,
    id: "1",
    user_id: existingUserId,
    user: mockPoster1,
    comments: [{
      count: 30
    }]
  },
  {
    body: "<div>I am the second post</div>",
    created_at: "2025-01-05 03:45:32.833949+00",
    file: null,
    id: "2",
    user_id: existingUserId,
    user: mockPoster2,
    comments: [{
      count: 5
    }]
  },
  {
    body: "<div>I am the third post</div>",
    created_at: "2025-01-05 03:45:32.833949+00",
    file: null,
    id: "3",
    user: mockPoster3,
    user_id: existingUserId,
    comments: [{
      count: 0
    }]
  },
  {
    body: "<div>I am the fourth post</div>",
    created_at: "2025-01-05 03:45:32.833949+00",
    file: null,
    id: "4",
    user: mockPoster2,
    user_id: existingUserId,
    comments: [{
      count: 1
    }]
  },
  {
    body: "<div>I am the fifth post</div>",
    created_at: "2025-01-05 03:45:32.833949+00",
    file: null,
    id: "5",
    user_id: existingUserId,
    user: mockUser,
    comments: [{
      count: 30
    }]
  },
  {
    body: "<div>I am the sixth post</div>",
    created_at: "2025-01-05 03:45:32.833949+00",
    file: null,
    id: "6",
    user: mockPoster1,
    user_id: existingUserId,
    comments: [{
      count: 2000
    }]
  }
]


const meta: Meta<typeof HomeView> = {
  title: 'app/(main)/home',
  component: HomeView,
  /** argType: action: '<actionName>' makes calling the function show up in Storybook log */
  argTypes: {
    handleEnd: {
      action: 'handleEnd'
    },
    setNumNotification: {
      action: 'setNumNotification'
    },
    hasMorePosts: {
      control: 'boolean',
      description: 'Whether feed stops fetching new posts',
    },
    
  },
  args: {
    user: mockUser,
    posts: [],
    numNotifications: 0
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 16, alignItems: 'flex-start' }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof HomeView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
export const ManyNotifications: Story = {
  args: {
    numNotifications: 9999
  },
};
export const PostNoComment: Story = {
  args: {
    posts: mockPostNoComments
  }
}
export const PostManyComment: Story = {
  args: {
    posts: mockSinglePostManyComments
  }
}
export const PostNoUser: Story = {
  args: {
    posts: mockPostNoUser
  }
}
export const ManyPost: Story = {
  args: {
    posts: mockManyPosts,
    numNotifications: 10
  }
}