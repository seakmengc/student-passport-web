import { authState } from 'src/states/auth';
import { getMyOffices } from 'src/states/offices';
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

    return getMyOffices()?.includes(officeId) ?? false;
  }

  static isSuperAdmin(ctx) {
    const auth = getAtom(authState, ctx);

    return auth.role === 'Super Admin';
  }
}
