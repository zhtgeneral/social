import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { EditProfileView } from '../../../../app/(main)/editProfile';


const mockUser = {
  name: "Mock user",
  image: "uploads/profiles/1734741351564.png",
  phone: "Mock phone",
  bio: "Mock bio",
  address: "Mock location"
}

const meta: Meta<typeof EditProfileView> = {
  title: 'app/(main)/editProfile',
  component: EditProfileView,
  argTypes: {
    updateFormData: { action: 'updateFormData' },
    onSubmit: {
      action: 'onSubmit',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state of the form',
    },
  },
  args: {
    formData: mockUser,
    user: mockUser
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 16, alignItems: 'flex-start' }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof EditProfileView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    user: {},
    formData: {}
  }
}
export const Default: Story = {
  args: {
    formData: mockUser
  },
};
export const Loading: Story = {
  args: {
    loading: true,
  },
};
export const LongFields: Story = {
  args: {
    formData: {
      name: "asjdfb,asmdnfvb,amsdfbna,smdnfba",      
      phone: "sdmfnba,smdnfba,smndbf asdf asdf asdf ",
      bio: "skadjfh laskdjfh laskdjfh alskdjfh alskdjfh alksdjfh alksdjhf alksdjhf lakjsdhf laksjdfh laksjh asdf asdf asdf asdf asdf asdf ",
      address: "zxmcnvz,xmcnvbz,xmcnvb,zxmncvb"
    },
  }
}
export const MissingImage: Story = {
  args: {
    formData: {
      name: mockUser.name,
      phone: mockUser.phone,
      bio: mockUser.bio,
      address: mockUser.address,
      image: ""
    },
    user: {
      ...mockUser,
      image: ""
    }
  }
}