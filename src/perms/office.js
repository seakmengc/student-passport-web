import { authState } from 'src/states/auth';
import { getAtom } from 'src/utils/atom-effect';
import { isEmpty } from 'src/utils/func';

export class OfficePerm {
  static isAdminOf(officeId, ctx) {
    const auth = getAtom(authState, ctx);
    if (auth.role !== 'Admin') {
      return auth.role === 'Super Admin';
    }

    if (isEmpty(officeId)) {
      return false;
    }

    return auth.admins?.includes(officeId) ?? false;
  }

  static isSuperAdmin(ctx) {
    const auth = getAtom(authState, ctx);

    return auth.role === 'Super Admin';
  }
}
