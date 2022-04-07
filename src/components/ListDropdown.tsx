import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, Transition } from "@headlessui/react";
import React from "react";

interface ListDropdownProps {
  children: JSX.Element[];
}

const ListDropdown = ({ children }: ListDropdownProps) => {
  return (
    <>
      <Menu as="div" className="relative text-left inline-block lg:hidden">
        <Menu.Button className="inline-flex justify-end w-full px-4 py-2 text-sm font-medium text-black">
          <FontAwesomeIcon icon={faAngleDown} />
        </Menu.Button>
        <Transition
          as={React.Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {children.map((child, index) => (
              <Menu.Item key={index}>{child}</Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
};

export default ListDropdown;
