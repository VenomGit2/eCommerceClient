import { render, screen } from '@testing-library/react';
import RatingBadge from './RatingBadge';

describe('RatingBadge', () => {
  it('renders the formatted rating inside a green pill with a star icon', () => {
    render(<RatingBadge value={4.2} ratingsCount={4178} reviewCount={418} />);
    const badge = screen.getByLabelText(
      'Rated 4.2 out of 5, 4,178 ratings and 418 reviews',
    );
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('rating-badge');
    expect(badge).toHaveClass('rating-badge--sm');
    expect(badge).toHaveClass('rating-badge--filled');
    expect(badge.querySelector('.rating-badge__pill')).not.toBeNull();
    expect(badge.querySelector('.rating-badge__value').textContent).toBe('4.2');
    expect(badge.querySelector('.rating-badge__star svg')).not.toBeNull();
    expect(badge.textContent).toContain('4,178 Ratings');
    expect(badge.textContent).toContain('418 Reviews');
  });

  it('uses the large size variant when requested', () => {
    render(<RatingBadge value={4.5} ratingsCount={10} reviewCount={5} size="lg" />);
    expect(screen.getByText('4.5').closest('.rating-badge')).toHaveClass('rating-badge--lg');
  });

  it('omits counts that are zero or missing', () => {
    render(<RatingBadge value={3.8} ratingsCount={0} reviewCount={12} />);
    const badge = screen.getByText('3.8').closest('.rating-badge');
    expect(badge.textContent).not.toContain('Ratings');
    expect(badge.textContent).toContain('12 Reviews');
  });

  it('shows a "No ratings yet" message when there is no rating or counts', () => {
    render(<RatingBadge value={0} ratingsCount={0} reviewCount={0} />);
    expect(screen.getByText('No ratings yet')).toBeInTheDocument();
  });

  it('formats numbers with the en-IN locale (e.g. lakh separators)', () => {
    render(<RatingBadge value={4} ratingsCount={123456} reviewCount={789} />);
    const badge = screen.getByText('4').closest('.rating-badge');
    expect(badge.textContent).toContain('1,23,456 Ratings');
    expect(badge.textContent).toContain('789 Reviews');
  });

  it('falls back to an empty pill class when there is no rating value', () => {
    render(<RatingBadge value={0} ratingsCount={5} reviewCount={5} />);
    const badge = screen.getByText('5 Ratings').closest('.rating-badge');
    expect(badge).toHaveClass('rating-badge--empty');
    expect(badge.querySelector('.rating-badge__pill')).toBeNull();
  });
});
