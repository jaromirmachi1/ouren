import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../../i18n/LanguageContext';
import type { Unit } from '../../types';

const Wrap = styled.div`
  display: grid;
  gap: 20px;
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const FilterButton = styled.button<{ $active?: boolean }>`
  min-height: 36px;
  padding: 0 14px;
  border: 1px solid
    ${({ $active, theme }) => ($active ? theme.colors.navy : theme.colors.brightLine)};
  background: ${({ $active, theme }) => ($active ? theme.colors.navy : 'transparent')};
  color: ${({ $active, theme }) => ($active ? theme.colors.white : theme.colors.brightMuted)};
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  transition:
    color 180ms cubic-bezier(0.23, 1, 0.32, 1),
    background 180ms cubic-bezier(0.23, 1, 0.32, 1),
    border-color 180ms cubic-bezier(0.23, 1, 0.32, 1),
    transform 120ms cubic-bezier(0.23, 1, 0.32, 1);

  &:hover,
  &:focus-visible {
    color: ${({ $active, theme }) => ($active ? theme.colors.white : theme.colors.navy)};
    border-color: ${({ theme }) => theme.colors.navy};
    outline: none;
  }

  &:active {
    transform: scale(0.97);
  }
`;

const TableWrap = styled.div`
  overflow-x: auto;
  border: 1px solid ${({ theme }) => theme.colors.brightLine};
  background: ${({ theme }) => theme.colors.brightSurface};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 720px;
`;

const Th = styled.th`
  padding: 14px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.brightLine};
  color: ${({ theme }) => theme.colors.brightMuted};
  font-size: 11px;
  font-weight: ${({ theme }) => theme.typography.weights.regular};
  letter-spacing: 0.14em;
  text-align: left;
  text-transform: uppercase;
`;

const Td = styled.td`
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.brightLine};
  color: ${({ theme }) => theme.colors.brightInk};
  font-size: 14px;
  font-variant-numeric: tabular-nums;
  vertical-align: middle;
`;

const Row = styled.tr<{ $muted?: boolean }>`
  opacity: ${({ $muted }) => ($muted ? 0.45 : 1)};
  transition: background 160ms cubic-bezier(0.23, 1, 0.32, 1);

  &:last-child ${Td} {
    border-bottom: 0;
  }

  &:hover {
    background: rgba(0, 10, 103, 0.03);
  }
`;

const Status = styled.span<{ $status: Unit['status'] }>`
  display: inline-flex;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ $status, theme }) => {
    if ($status === 'available') return '#1F7A3F';
    if ($status === 'reserved') return '#9A6B16';
    if ($status === 'rented') return '#3B4F9A';
    return theme.colors.brightMuted;
  }};
`;

const Empty = styled.p`
  color: ${({ theme }) => theme.colors.brightMuted};
  font-size: 15px;
`;

type Filter = 'all' | Unit['status'];

type UnitInventoryProps = {
  units: Unit[];
};

function formatCzk(value: number, locale: string) {
  return new Intl.NumberFormat(locale === 'cs' ? 'cs-CZ' : 'en-GB').format(value);
}

export function UnitInventory({ units }: UnitInventoryProps) {
  const { locale, t } = useLanguage();
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return units;
    return units.filter((unit) => unit.status === filter);
  }, [filter, units]);

  if (!units.length) {
    return <Empty>{t.projects.noUnits}</Empty>;
  }

  return (
    <Wrap>
      <Toolbar>
        {(
          [
            ['all', t.projects.filterAll],
            ['available', t.projects.filterAvailable],
            ['reserved', t.projects.filterReserved],
            ['sold', t.projects.filterSold],
            ['rented', t.projects.filterRented],
          ] as const
        ).map(([key, label]) => (
          <FilterButton
            $active={filter === key}
            className="hoverable"
            key={key}
            type="button"
            onClick={() => setFilter(key)}
          >
            {label}
          </FilterButton>
        ))}
      </Toolbar>

      <TableWrap>
        <Table>
          <thead>
            <tr>
              <Th>{t.projects.table.unit}</Th>
              <Th>{t.projects.table.floor}</Th>
              <Th>{t.projects.table.layout}</Th>
              <Th>{t.projects.table.area}</Th>
              <Th>{t.projects.table.terrace}</Th>
              <Th>{t.projects.table.price}</Th>
              <Th>{t.projects.table.status}</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((unit) => (
              <Row $muted={unit.status === 'sold' || unit.status === 'rented'} key={unit.id}>
                <Td>{unit.number}</Td>
                <Td>{unit.floor}</Td>
                <Td>{unit.layout}</Td>
                <Td>{unit.area} m²</Td>
                <Td>{unit.terrace ? `${unit.terrace} m²` : '—'}</Td>
                <Td>
                  {formatCzk(unit.price, locale)} {locale === 'cs' ? 'Kč' : 'CZK'}
                </Td>
                <Td>
                  <Status $status={unit.status}>{t.status[unit.status]}</Status>
                </Td>
              </Row>
            ))}
          </tbody>
        </Table>
      </TableWrap>
    </Wrap>
  );
}
