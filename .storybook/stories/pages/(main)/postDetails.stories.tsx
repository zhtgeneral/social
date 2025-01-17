import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { PostDetailsView } from '../../../../app/(main)/postDetails';

/**
 * @requires image needs to be in the database
 */
const mockUser = {
  id: "Owner",
  name: "Mock user",
  image: "uploads/profiles/1734741351564.png",
  phone: "Mock phone",
  bio: "Mock bio",
  address: "Mock location"
}
const mockCommenter1 = {
  name: "Mock user",
  image: "uploads/profiles/1732332703510.png",
  phone: "Mock phone",
  bio: "Mock bio",
  address: "Mock location"
}
const mockCommenter2 = {
  name: "Mock user",
  image: "uploads/profiles/1732332874913.png",
  phone: "Mock phone",
  bio: "Mock bio",
  address: "Mock location"
}
const mockCommenter3 = {
  name: "Mock user",
  image: "uploads/profiles/1732332913020.png",
  phone: "Mock phone",
  bio: "Mock bio",
  address: "Mock location"  
}
const mockCommenter4 = {
  name: "Mock user",
  image: "uploads/profiles/1732333173502.png",
  phone: "Mock phone",
  bio: "Mock bio",
  address: "Mock location"  
}
const mockPostSingleComment = {
  body: "<p>Mock post</p>",
  created_at: "2025-01-05 03:45:32.833949+00",
  file: null,
  id: "Mock id",
  user_id: "Mock user id",
  user: mockUser,
  comments: [
    {
      created_at: "2025-01-05 03:45:32.833949+00",
      id: "1",
      post_id: "Mock post id",
      text: "Mock comment",
      user_id: "Mock sender id",
      user: mockCommenter1
    },
  ]
}
const mockPostManyComments = {
  body: "<p>Mock post</p>",
  created_at: "2025-01-05 03:45:32.833949+00",
  file: null,
  id: "Mock id",
  user_id: "Mock user id",
  user: mockUser,
  postLikes: [
    {
      created_at: "2025-01-05 03:45:32.833949+00",
      id: "Mock post like id",
      post_id: "Mock post id",
      user_id: "Mock liker"
    },
    {
      created_at: "2025-01-05 03:45:32.833949+00",
      id: "Mock post like id",
      post_id: "Mock post id",
      user_id: "Mock liker"
    }
  ],
  comments: [
    {
      created_at: "2025-01-05 03:45:32.833949+00",
      id: "1",
      post_id: "Mock post id",
      text: "Mock comment",
      user_id: "Mock sender id",
      user: mockCommenter1
    },
    {
      created_at: "2025-01-05 03:45:32.833949+00",
      id: "2",
      post_id: "Mock post id",
      text: "Mock comment",
      user_id: "Mock sender id",
      user: mockCommenter2
    },
    {
      created_at: "2025-01-05 03:45:32.833949+00",
      id: "3",
      post_id: "Mock post id",
      text: "Mock comment",
      user_id: "Mock sender id",
      user: mockCommenter3
    },
    {
      created_at: "2025-01-05 03:45:32.833949+00",
      id: "4",
      post_id: "Mock post id",
      text: "Mock comment",
      user_id: "Mock sender id",
      user: mockCommenter2
    },
    {
      created_at: "2025-01-05 03:45:32.833949+00",
      id: "5",
      post_id: "Mock post id",
      text: "Mock comment",
      user_id: "Mock sender id",
      user: mockCommenter4
    },
  ]
}
const mockPostIsOwner = {
  body: "<p>Mock post</p>",
  created_at: "2025-01-05 03:45:32.833949+00",
  file: null,
  id: "Mock id",
  user_id: "Owner",
  user: mockUser,
  comments: [
    {
      created_at: "2025-01-05 03:45:32.833949+00",
      id: "1",
      post_id: "Mock post id",
      text: "Mock comment",
      user_id: "Mock sender id",
      user: mockCommenter1
    },
  ]
}
const meta: Meta<typeof PostDetailsView> = {
  title: 'app/(main)/postDetails',
  component: PostDetailsView,
  argTypes: {
    setLoading: {
      action: "setLoading"
    },
    setPost: {
      action: "setPost"
    }
  },
  args: {
    user: mockUser,
    init: true,
    loading: false,
    formattedPost: {}
    
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 0, alignItems: 'flex-start' }}>
        <Story />
      </View>
    ),
  ],
} 

export default meta;

type Story = StoryObj<typeof meta>;

export const NotInitialized: Story = {
  args: {
    init: false,
  }
};
export const SingleComment: Story = {
  args: {
    formattedPost: mockPostSingleComment
  }
};
export const ManyComments: Story = {
  args: {
    formattedPost: mockPostManyComments
  } 
}
export const Loading: Story = {
  args: {
    formattedPost: mockPostManyComments,
    loading: true
  } 
}
export const OwnerOfPost: Story = {
  args: {
    formattedPost: mockPostIsOwner,
  } 
}