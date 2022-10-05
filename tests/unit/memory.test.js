const MemoryInterface = require('../../src/model/data/memory/index');

describe('In-Memory Database calls', () => {
  test('Write metadata with invalid keys: writeFragment() throws Exception', async () => {
    // Construct a fragment metadata with invalid key
    const fragment_metadata = {
      ownerId: 1234,
      id: 100131,
      data: {
        a: 2,
        b: 3,
      },
    };
    expect(async () => await MemoryInterface.writeFragment(fragment_metadata)).rejects.toThrow();
    expect(async () => await MemoryInterface.writeFragment()).rejects.toThrow();
  });

  test('Write metadata: writeFragment() returns nothing', async () => {
    // Construct a fragment metadata
    const fragment_metadata = {
      ownerId: 'user1@gmail.com',
      id: '123',
      data: {
        a: 2,
        b: 3,
      },
    };
    const result = await MemoryInterface.writeFragment(fragment_metadata);
    expect(result).toBe(undefined);
  });

  test('Write metadata with no data: writeFragment() returns metadata with empty fragment', async () => {
    // Construct a fragment metadata
    const fragment_metadata = {
      ownerId: 'user1@gmail.com',
      id: '123',
      data: {},
    };
    // Write a fragment metadata without a data
    await MemoryInterface.writeFragment(fragment_metadata);
    // Read a fragment metadata
    const result = await MemoryInterface.readFragment('user1@gmail.com', '123');
    expect(result.data).toMatchObject({});
  });

  test('Read metadata with invalid keys: readFragment() throws Exception', async () => {
    // Construct a fragment metadata
    const fragment_metadata = {
      ownerId: 'user1@gmail.com',
      id: '123',
      data: {
        a: 2,
        b: 3,
      },
    };
    // Write a fragment metadata to In-Memory Database
    await MemoryInterface.writeFragment(fragment_metadata);

    expect(async () => await MemoryInterface.readFragment(123)).rejects.toThrow();
    expect(async () => await MemoryInterface.readFragment(123, 1000213)).rejects.toThrow();
  });

  test('Read metadata that does not exists in the database: readFragment() returns nothing', async () => {
    const result = await MemoryInterface.readFragment('user2@gmail.com', '123');
    expect(result).toBe(undefined);
  });

  test('Read metadata: readFragment() returns the fragment metadata that we have added', async () => {
    // Construct a fragment metadata
    const fragment_metadata = {
      ownerId: 'user1@gmail.com',
      id: '123',
      data: {
        a: 2,
        b: 3,
      },
    };
    // Write a fragment metadata to In-Memory Database
    await MemoryInterface.writeFragment(fragment_metadata);
    // Read fragments metadata
    const result = await MemoryInterface.readFragment('user1@gmail.com', '123');
    expect(result).toBe(fragment_metadata);
  });

  test('Write fragment data with invalid keys: writeFragmentData() throws Exception', async () => {
    const new_data = {
      b: 4,
      c: 5,
    };
    expect(async () => await MemoryInterface.writeFragmentData(123, new_data)).rejects.toThrow();
    expect(async () => await MemoryInterface.writeFragmentData(123, 100491)).rejects.toThrow();
    expect(
      async () => await MemoryInterface.writeFragmentData(123, 100491, new_data)
    ).rejects.toThrow();
  });

  test('Write fragment data with empty data: writeFragmentData() returns empty data', async () => {
    const new_data = {};
    // Write fragments data
    await MemoryInterface.writeFragmentData('user2@gmail.com', '100491', new_data);
    const result = await MemoryInterface.readFragmentData('user2@gmail.com', '100491');
    expect(result).toMatchObject({});
  });

  test('Write fragment data: writeFragmentData() data should exists in the database', async () => {
    const new_data = {
      b: 4,
      c: 5,
    };
    // Write fragments data
    await MemoryInterface.writeFragmentData('user2@gmail.com', '100491', new_data);
    // Read fragments data
    const result = await MemoryInterface.readFragmentData('user2@gmail.com', '100491');
    expect(result).toBe(new_data);
  });

  test('Read fragment data with invalid keys: readFragmentData() throws Exception', async () => {
    expect(async () => {
      await MemoryInterface.readFragment();
    }).rejects.toThrow();
    expect(async () => {
      await MemoryInterface.readFragment(1234, 1000319);
    }).rejects.toThrow();
  });

  test('Read fragment data that does not exist: readFragmentData() returns nothing (undefined)', async () => {
    const result = await MemoryInterface.readFragment('user12391@gmail.com', '1000319319');
    expect(result).toBe(undefined);
  });

  test('Read fragment data: readFragmentData()', async () => {
    const new_data = {
      c: 4,
      d: 5,
    };
    // Write a fragment metadata to In-Memory Database
    await MemoryInterface.writeFragmentData('user1@gmail.com', '123', new_data);
    const result = await MemoryInterface.readFragmentData('user1@gmail.com', '123');
    expect(result).toBe(new_data);
  });

  test('List fragments for the given user, invalid keys: listFragments() throws error', async () => {
    expect(async () => {
      await MemoryInterface.listFragments();
    }).rejects.toThrow();
    expect(async () => {
      await MemoryInterface.listFragments(134895);
    }).rejects.toThrow();
  });

  test('List fragments for the given user, user does not exist: listFragments() returns empty array', async () => {
    const result = MemoryInterface.listFragments('user_not_exist@gmail.com');
    expect(result).toMatchObject({});
  });

  test('List fragments for the given user: listFragments() returns list of fragment ids', async () => {
    // Construct fragments metadata
    const fragments_metadata = [
      {
        ownerId: 'user1@gmail.com',
        id: '123',
        data: {
          a: 2,
          b: 3,
        },
      },
      {
        ownerId: 'user1@gmail.com',
        id: '456',
        data: {
          c: 4,
          d: 5,
        },
      },
    ];
    fragments_metadata.forEach(async (fragment) => {
      // Write a fragment metadata to In-Memory Database
      await MemoryInterface.writeFragment(fragment);
    });
    const results = await MemoryInterface.listFragments('user1@gmail.com', false);
    expect(Array.isArray(results)).toBe(true);
    expect(results).toEqual(['123', '456']);
  });

  test('List fragments with metadata information for the given user: listFragments() returns list of fragments expanded', async () => {
    // Construct fragments metadata
    const fragments_metadata = [
      {
        ownerId: 'user1@gmail.com',
        id: '123',
        data: {
          a: 2,
          b: 3,
        },
      },
      {
        ownerId: 'user1@gmail.com',
        id: '456',
        data: {
          c: 4,
          d: 5,
        },
      },
    ];
    fragments_metadata.forEach(async (fragment) => {
      // Write a fragment metadata to In-Memory Database
      await MemoryInterface.writeFragment(fragment);
    });
    const results = await MemoryInterface.listFragments('user1@gmail.com', true);
    expect(Array.isArray(results)).toBe(true);
    expect(results).toEqual(fragments_metadata);
  });

  test('Delete fragments metadata and data from, invalid keys: deleteFragment() throws Exception', async () => {
    expect(async () => {
      await MemoryInterface.deleteFragment();
    }).rejects.toThrow();
    expect(async () => {
      await MemoryInterface.deleteFragment(134895);
    }).rejects.toThrow();
    expect(async () => {
      await MemoryInterface.deleteFragment(134895, 102149);
    }).rejects.toThrow();
  });

  test('Delete fragments metadata and data, owner does not exist in the database: deleteFragment() throws Exception', async () => {
    expect(async () => {
      await MemoryInterface.deleteFragment('user_does_not_exist@gmail.com', '12908124');
    }).rejects.toThrow();
  });

  test('Delete fragments metadata and data: deleteFragment() removes fragment by id (owner id and fragment id)', async () => {
    // Construct a fragment metadata
    const fragment_metadata = {
      ownerId: 'user3@gmail.com',
      id: '123',
      data: {
        a: 2,
        b: 3,
      },
    };
    // Write a fragment metadata
    await MemoryInterface.writeFragment(fragment_metadata);
    // Write fragment data
    await MemoryInterface.writeFragmentData('user3@gmail.com', '123', { c: 4, d: 5 });
    expect(await MemoryInterface.readFragment('user3@gmail.com', '123')).toBe(fragment_metadata);
    // Remove fragment
    await MemoryInterface.deleteFragment('user3@gmail.com', '123');
    expect(await MemoryInterface.readFragment('user3@gmail.com', '123')).toBe(undefined);
  });

  test('Delete one of the fragments metadata and data: deleteFragment() removes fragment by id (owner id and fragment id)', async () => {
    // Construct fragments metadata
    const fragments_metadata = [
      {
        ownerId: 'user1@gmail.com',
        id: '123',
        data: {
          a: 2,
          b: 3,
        },
      },
      {
        ownerId: 'user1@gmail.com',
        id: '456',
        data: {
          c: 4,
          d: 5,
        },
      },
    ];

    const fragments_new_data = {
      123: [
        {
          c: 4,
          d: 5,
        },
      ],
      456: [
        {
          e: 6,
          f: 7,
        },
      ],
    };
    fragments_metadata.forEach(async (fragment) => {
      // Write fragment metadata
      await MemoryInterface.writeFragment(fragment);
    });
    for (const id in fragments_new_data) {
      // Write fragment data for user 'user1@gmail.com'
      await MemoryInterface.writeFragmentData('user1@gmail.com', id, fragments_new_data[id]);
    }
    // Remove fragment
    await MemoryInterface.deleteFragment('user1@gmail.com', '123');
    const results = await MemoryInterface.listFragments('user1@gmail.com', false);
    expect(Array.isArray(results)).toBe(true);
    expect(results).toEqual(['456']);
  });
});
