import { describe, it, expect } from "vitest";
import { practiceItemDenial } from "./practice-access.ts";
import { assignPool } from "@domigo/content-loader/pools";
describe("the one practice eligibility rule",()=>{
  for(const grade of [1,2,3,4]) it(`year ${grade}: reserve and year both apply`,()=>{
    for(const kind of ["w.word","gi.structure.gf.001","li.task.mc.001","ti.read.mc.001","ci.story.mc.001"]){
      const id=`g${grade}u01.${kind}`;expect(practiceItemDenial(id,grade,new Set())).toBeNull();
      expect(practiceItemDenial(id,grade%4+1,new Set())).toBe("wrong_grade");
      expect(assignPool(id,new Set([id]))).toBe("mock");expect(practiceItemDenial(id,grade,new Set([id]))).toBe("item_reserved");
      expect(practiceItemDenial(id,grade,new Set(["g9u01.w.other"]))).toBeNull();
    }
  });
  for(const grade of [null,0,5,2.5,NaN])it(`unknown/invalid grade ${grade} cannot authorize`,()=>{expect(practiceItemDenial("g2u01.w.word",grade,new Set())).toBe("grade_unavailable");});
});
