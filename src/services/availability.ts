interface Availability {
  id: string;
  attributes: {
    from: string;
  };
}

export function listAvailabilities(
  fpId: string,
  from: string,
  to: string
): Availability[] {
  return [
    {
      id: 'random_id_1',
      attributes: {
        from: new Date(2020, 3, 7, 1).toISOString(),
      },
    },
    {
      id: 'random_id_2',
      attributes: {
        from: new Date(2020, 3, 7, 1, 30).toISOString(),
      },
    },
  ];
}
