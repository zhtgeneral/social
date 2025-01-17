import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { NewPostView } from '../../../../app/(main)/newPost';

/**
 * @requires image needs to be in the database
 */
const mockUser = {
  name: "Mock user",
  image: "uploads/profiles/1734741351564.png",
  phone: "Mock phone",
  bio: "Mock bio",
  address: "Mock location"
}

const meta: Meta<typeof NewPostView> = {
  title: 'app/(main)/newPost',
  component: NewPostView,
  argTypes: {
    setLoading: {
      action: "setLoading"
    },
    setFile: {
      action: 'setFile'
    }
  },
  args: {
    user: {},
    post: {},
    loading: false,
    file: null
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 16, alignItems: 'flex-start' }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof NewPostView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NoUser: Story = {}
export const Loading: Story = {
  args: {
    user: mockUser,
    loading: true
  }
}
/** TODO add mock posts but first need to fix 'React Native WebView does not support this platform' */
