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

  static isAdminOfOffice(office, ctx) {
    const auth = getAtom(authState, ctx);
    if (auth.role !== 'Admin') {
      return auth.role === 'Super Admin';
    }

    if (!office) {
      return false;
    }

    return office.admins?.includes(auth._id) ?? false;
  }

  static isAdminOfUnit(unit, ctx) {
    const auth = getAtom(authState, ctx);
    if (auth.role !== 'Admin') {
      return auth.role === 'Super Admin';
    }

    if (!unit) {
      return false;
    }

    return (
      unit?.admins?.includes(auth._id) ||
      unit.parent?.admins?.includes(auth._id)
    );
  }

  static isSuperAdmin(ctx) {
    const auth = getAtom(authState, ctx);

    return auth.role === 'Super Admin';
  }
}
