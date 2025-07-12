import { User, SwapRequest, Feedback } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    location: 'San Francisco, CA',
    skillsOffered: ['React', 'JavaScript', 'UI/UX Design', 'Figma'],
    skillsWanted: ['Python', 'Data Science', 'Machine Learning'],
    availability: ['Weekends', 'Evenings'],
    isPublic: true,
    rating: 4.8,
    totalSwaps: 12,
    joinDate: '2024-01-15',
    isAdmin: true,
    isBanned: false
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael@example.com',
    location: 'New York, NY',
    skillsOffered: ['Python', 'Data Science', 'SQL', 'Tableau'],
    skillsWanted: ['React', 'Frontend Development', 'TypeScript'],
    availability: ['Weekdays', 'Mornings'],
    isPublic: true,
    rating: 4.9,
    totalSwaps: 18,
    joinDate: '2023-11-20',
    isAdmin: false,
    isBanned: false
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily@example.com',
    location: 'Austin, TX',
    skillsOffered: ['Content Writing', 'SEO', 'Social Media Marketing'],
    skillsWanted: ['Graphic Design', 'Video Editing', 'Photography'],
    availability: ['Flexible', 'Weekends'],
    isPublic: true,
    rating: 4.7,
    totalSwaps: 8,
    joinDate: '2024-02-03',
    isAdmin: false,
    isBanned: false
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david@example.com',
    location: 'Seattle, WA',
    skillsOffered: ['Photography', 'Video Editing', 'Adobe Premiere'],
    skillsWanted: ['Web Development', 'WordPress', 'E-commerce'],
    availability: ['Weekends', 'Evenings'],
    isPublic: true,
    rating: 4.6,
    totalSwaps: 15,
    joinDate: '2023-12-10',
    isAdmin: false,
    isBanned: false
  },
  {
    id: '5',
    name: 'Lisa Wang',
    email: 'lisa@example.com',
    location: 'Los Angeles, CA',
    skillsOffered: ['Graphic Design', 'Illustrator', 'Branding'],
    skillsWanted: ['Animation', '3D Modeling', 'After Effects'],
    availability: ['Weekdays', 'Flexible'],
    isPublic: true,
    rating: 4.9,
    totalSwaps: 22,
    joinDate: '2023-10-05',
    isAdmin: false,
    isBanned: false
  },
  {
    id: '6',
    name: 'Alex Thompson',
    email: 'alex@example.com',
    location: 'Boston, MA',
    skillsOffered: ['Node.js', 'Express', 'MongoDB'],
    skillsWanted: ['DevOps', 'AWS', 'Docker'],
    availability: ['Evenings'],
    isPublic: true,
    rating: 4.5,
    totalSwaps: 9,
    joinDate: '2024-01-28',
    isAdmin: false,
    isBanned: false
  }
];

export const mockRequests: SwapRequest[] = [
  {
    id: '1',
    fromUserId: '2',
    toUserId: '1',
    skillOffered: 'Python',
    skillWanted: 'React',
    message: 'Hi Sarah! I love your portfolio and would love to learn React from you. I can teach you Python and data science fundamentals in return.',
    status: 'pending',
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z'
  },
  {
    id: '2',
    fromUserId: '3',
    toUserId: '5',
    skillOffered: 'Content Writing',
    skillWanted: 'Graphic Design',
    message: 'Would love to trade content writing skills for graphic design lessons!',
    status: 'accepted',
    createdAt: '2024-03-14T14:30:00Z',
    updatedAt: '2024-03-14T15:00:00Z'
  },
  {
    id: '3',
    fromUserId: '1',
    toUserId: '4',
    skillOffered: 'UI/UX Design',
    skillWanted: 'Photography',
    message: 'Hi David! I can help you with UI/UX design principles if you can teach me photography basics.',
    status: 'completed',
    createdAt: '2024-03-10T09:00:00Z',
    updatedAt: '2024-03-12T16:00:00Z'
  },
  {
    id: '4',
    fromUserId: '6',
    toUserId: '2',
    skillOffered: 'Node.js',
    skillWanted: 'Data Science',
    message: 'Interested in learning data science. I can teach you backend development with Node.js.',
    status: 'pending',
    createdAt: '2024-03-16T11:00:00Z',
    updatedAt: '2024-03-16T11:00:00Z'
  }
];

export const mockFeedback: Feedback[] = [
  {
    id: '1',
    swapId: '3',
    fromUserId: '1',
    toUserId: '4',
    rating: 5,
    comment: 'David was an excellent teacher! His photography tips were super helpful and practical.',
    createdAt: '2024-03-12T18:00:00Z'
  },
  {
    id: '2',
    swapId: '3',
    fromUserId: '4',
    toUserId: '1',
    rating: 5,
    comment: 'Sarah helped me understand UI/UX principles really well. Great mentor!',
    createdAt: '2024-03-12T18:30:00Z'
  }
];