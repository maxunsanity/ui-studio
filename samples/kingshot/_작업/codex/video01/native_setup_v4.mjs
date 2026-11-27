import {create as setup} from './native_setup_v3.mjs';
export function create(t,assets){const u=setup(t,assets),seed=u.seed;
 u.seed=async(...args)=>{const b=await seed(...args);await u.o.order(b.id,'맨 앞으로');return b;};
 return u;
}
