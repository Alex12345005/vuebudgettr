//components/__test__/AgeGuess.test.js
import { test, expect } from "vitest";
//import mount
import { mount } from "@vue/test-utils";

//import your component
import Cashflow from "../Cashflow.vue";

test("Button clicked", async () => {
    expect(Cashflow).toBeTruthy();
  
    const wrapper = mount(Cashflow, {
      props: {
        title: "Test the Add Button",
      },
    });
    const verifyClick = await wrapper.get("button").trigger("click");
    expect(wrapper.vm.user.search).toEqual(null);
  });