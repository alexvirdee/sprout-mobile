/**
 * Component library barrel. Import primitives from a single place:
 *   import { Button, Card, PlantCard } from '@components/index';
 */

// Core UI
export { Text } from './ui/Text';
export type { TextProps } from './ui/Text';
export { Button } from './ui/Button';
export type { ButtonProps } from './ui/Button';
export { IconButton } from './ui/IconButton';
export type { IconButtonProps } from './ui/IconButton';
export { Card } from './ui/Card';
export type { CardProps } from './ui/Card';
export { Badge } from './ui/Badge';
export type { BadgeProps, BadgeTone } from './ui/Badge';
export { Avatar } from './ui/Avatar';
export type { AvatarProps } from './ui/Avatar';
export { Input } from './ui/Input';
export type { InputProps } from './ui/Input';
export { Checkbox } from './ui/Checkbox';
export type { CheckboxProps } from './ui/Checkbox';
export { Switch } from './ui/Switch';
export type { SwitchProps } from './ui/Switch';
export { SegmentedControl } from './ui/SegmentedControl';
export type { SegmentedControlProps, SegmentOption } from './ui/SegmentedControl';
export { ProgressRing } from './ui/ProgressRing';
export type { ProgressRingProps } from './ui/ProgressRing';

// Garden
export { StatTile } from './garden/StatTile';
export type { StatTileProps } from './garden/StatTile';
export { PlantCard } from './garden/PlantCard';
export type { PlantCardProps, PlantStatus } from './garden/PlantCard';
export { AchievementBadge } from './garden/AchievementBadge';
export type { AchievementBadgeProps } from './garden/AchievementBadge';

// Feedback
export { EmptyState } from './feedback/EmptyState';
export type { EmptyStateProps } from './feedback/EmptyState';
export { Spinner, Skeleton, SkeletonCard } from './feedback/LoadingState';
export type { SkeletonProps } from './feedback/LoadingState';

// Layout
export { ScreenContainer } from './layout/ScreenContainer';
export type { ScreenContainerProps } from './layout/ScreenContainer';
export { SectionHeader } from './layout/SectionHeader';
export type { SectionHeaderProps } from './layout/SectionHeader';
export { GradientBackground } from './layout/GradientBackground';
export type { GradientBackgroundProps } from './layout/GradientBackground';

// Brand
export { Logo, LogoMark } from './brand/Logo';
export type { LogoProps } from './brand/Logo';
