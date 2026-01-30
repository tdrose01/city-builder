import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SocialTab from '../Social/SocialTab';
import { generateMockFriends, SOCIAL_CONFIG } from '../../config/social';

describe('Social System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Mock Data Generation', () => {
    test('generateMockFriends creates correct number of friends', () => {
      const friends = generateMockFriends(1, 5);
      expect(friends).toHaveLength(5);
    });

    test('friends have required properties', () => {
      const friends = generateMockFriends(1, 1);
      const friend = friends[0];
      
      expect(friend).toHaveProperty('id');
      expect(friend).toHaveProperty('name');
      expect(friend).toHaveProperty('level');
      expect(friend).toHaveProperty('netWorth');
      expect(friend).toHaveProperty('giftSent');
      expect(friend).toHaveProperty('giftReceived');
    });
  });

  describe('SocialTab Component', () => {
    const mockFriends = [
      {
        id: '1',
        name: 'Friend 1',
        avatar: '🤠',
        level: 2,
        netWorth: 5000,
        giftSent: false,
        giftReceived: true,
        isPlayer: false
      },
      {
        id: '2',
        name: 'Friend 2',
        avatar: '👽',
        level: 1,
        netWorth: 2000,
        giftSent: true,
        giftReceived: false,
        isPlayer: false
      }
    ];

    const defaultProps = {
      friends: mockFriends,
      cityLevel: 1,
      netWorth: 3000,
      themeColor: '#00f3ff',
      onSendGift: vi.fn(),
      onReceiveGift: vi.fn(),
      dailyGiftCount: 0
    };

    test('renders leaderboard with friends and player', () => {
      render(<SocialTab {...defaultProps} />);
      
      expect(screen.getByText('Friend 1')).toBeInTheDocument();
      expect(screen.getByText('Friend 2')).toBeInTheDocument();
      expect(screen.getByText('YOU')).toBeInTheDocument();
    });

    test('ranks players correctly by net worth', () => {
      render(<SocialTab {...defaultProps} />);
      
      // Order should be Friend 1 (5000) > YOU (3000) > Friend 2 (2000)
      const items = screen.getAllByText(/Friend 1|Friend 2|YOU/);
      expect(items[0]).toHaveTextContent('Friend 1');
      expect(items[1]).toHaveTextContent('YOU');
      expect(items[2]).toHaveTextContent('Friend 2');
    });

    test('renders correct actions based on gift state', () => {
      render(<SocialTab {...defaultProps} />);
      
      expect(screen.getByText('GET GIFT')).toBeInTheDocument(); // Friend 1
      expect(screen.getByText('Sent ✓')).toBeInTheDocument();   // Friend 2
    });

    test('calls onSendGift when Send button clicked', () => {
      render(<SocialTab {...defaultProps} />);
      
      // Since Friend 1 hasn't been sent a gift and we aren't Player, Send should appear
      // Wait, let's verify Friend 1 state: giftSent: false.
      const sendButtons = screen.getAllByText('SEND');
      fireEvent.click(sendButtons[0]);
      
      expect(defaultProps.onSendGift).toHaveBeenCalledWith('1');
    });

    test('calls onReceiveGift when Get Gift button clicked', () => {
      render(<SocialTab {...defaultProps} />);
      
      fireEvent.click(screen.getByText('GET GIFT'));
      
      expect(defaultProps.onReceiveGift).toHaveBeenCalledWith('1');
    });
  });
});
