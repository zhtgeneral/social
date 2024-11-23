import { Database } from '@/database.types';

export type User          = Database['public']['Tables']['users']['Row'];
export type Comment       = Database['public']['Tables']['comments']['Row'];
export type Notification  = Database['public']['Tables']['notifications']['Row'];
export type PostLike      = Database['public']['Tables']['postLikes']['Row'];
export type Post          = Database['public']['Tables']['posts']['Row'];