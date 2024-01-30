import { Request, Response } from 'express';

import { createOrGetDb } from '~/db';
import { UserTable } from '~/db/schema';
import { test } from '~/lib/user';

export async function list(_req: Request, res: Response) {
  const db = await createOrGetDb();
  const users = await db.select().from(UserTable);

  test();

  res.json(users);
}

export default { list };
