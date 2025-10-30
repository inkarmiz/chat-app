import { useEffect } from "react";
import NewDM from "./components/new-dm";
import ProfileInfo from "./components/profile-info";
import { apiClient } from "@/lib/api-client";
import {
  GET_DM_CONTACTS_ROUTES,
  GET_USER_CHANNELS_ROUTE,
} from "@/utils/constants";
import { useAppStore } from "@/store";
import ContactList from "@/components/ui/contact-list";
import CreateChannel from "./components/create-channel";

const ContactsContainer = () => {
  const {
    directMessagesContacts,
    setDirectMessagesContacts,
    channels,
    setChannels,
  } = useAppStore();

  useEffect(() => {
    /**
     * Fetch direct-message contacts from the server and store them in global state.
     *
     * - Sends the request with credentials (cookies) so authenticated endpoints work.
     * - On success, updates the store with the received contacts via setDirectMessagesContacts.
     *
     * @returns {Promise<void>}
     */
    const getContacts = async () => {
      const response = await apiClient.get(GET_DM_CONTACTS_ROUTES, {
        withCredentials: true,
      });
      if (response.data.contacts) {
        setDirectMessagesContacts(response.data.contacts);
      }
    };

    /**
     * Fetch channels for the current user and store them in global state.
     *
     * - Sends the request with credentials (cookies) so authenticated endpoints work.
     * - On success, updates the store with the received channels via setChannels.
     *
     * @returns {Promise<void>}
     */
    const getChannels = async () => {
      const response = await apiClient.get(GET_USER_CHANNELS_ROUTE, {
        withCredentials: true,
      });
      if (response.data.channels) {
        setChannels(response.data.channels);
      }
    };
    getContacts();
    getChannels();
  }, [setChannels, setDirectMessagesContacts]);

  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
      <div className="pt-3">
        <Logo />
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Direct Messages" />
          <NewDM />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={directMessagesContacts} />
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Channels" />
          <CreateChannel />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={channels} isChannel={true} />
        </div>
      </div>
      <ProfileInfo />
    </div>
  );
};

export default ContactsContainer;

const Logo = () => {
  return (
    <div className="flex p-5  justify-start items-center gap-2">
      <svg
        width="78"
        height="32"
        viewBox="0 0 78 32"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="logoGradient"
            x1="0"
            y1="0"
            x2="78"
            y2="32"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stop-color="#ec4899" />
            <stop offset="50%" stop-color="#22c55e" />
            <stop offset="100%" stop-color="#3b82f6" />
          </linearGradient>
        </defs>

        <path
          d="M5 25C15 10 25 10 35 25C45 40 55 10 65 5C70 3 75 8 75 16C75 24 65 30 55 28C45 26 35 18 25 20C15 22 10 28 5 25Z"
          fill="url(#logoGradient)"
        />
      </svg>
      <span className="text-3xl font-semibold ">Privet</span>
    </div>
  );
};

const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  );
};
