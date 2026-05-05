"use client";
import React from "react";
import { DEVLINK_SCOPE_CLASS } from "./devlinkScope";
import Block from "./webflow_modules/Basic/components/Block";
import DOM from "./webflow_modules/Builtin/components/DOM";
import DropdownList from "./webflow_modules/Dropdown/components/DropdownList";
import DropdownToggle from "./webflow_modules/Dropdown/components/DropdownToggle";
import DropdownWrapper from "./webflow_modules/Dropdown/components/DropdownWrapper";
import Grid from "./webflow_modules/Layout/components/Grid";
import Icon from "./webflow_modules/Icon/components/Icon";
import Link from "./webflow_modules/Basic/components/Link";
import List from "./webflow_modules/Basic/components/List";
import ListItem from "./webflow_modules/Basic/components/ListItem";
import NavbarButton from "./webflow_modules/Navbar/components/NavbarButton";
import NavbarMenu from "./webflow_modules/Navbar/components/NavbarMenu";
import NavbarWrapper from "./webflow_modules/Navbar/components/NavbarWrapper";
import Paragraph from "./webflow_modules/Basic/components/Paragraph";
import Strong from "./webflow_modules/Basic/components/Strong";

export function Navigation({}) {
  return (
    <div
      className={DEVLINK_SCOPE_CLASS}
      style={{
        display: "contents",
      }}
    >
      <Block className={"nav is-inverse"} tag={"div"}>
        <NavbarWrapper
          className={"nav_container"}
          config={{
            easing: "ease",
            easing2: "ease",
            duration: 400,
            docHeight: false,
            noScroll: true,
            animation: "default",
            collapse: "medium",
          }}
          data-animation={"default"}
          data-collapse={"medium"}
          data-duration={"400"}
          data-easing={"ease"}
          data-easing2={"ease"}
          data-no-scroll={"1"}
          role={"banner"}
          tag={"div"}
        >
          <Block
            className={"nav_left"}
            id={"w-node-_3f0395f7-889c-390a-07ca-0ee21a48b2ce-3bb61a75"}
            tag={"div"}
          >
            <Link
              block={"inline"}
              button={false}
              className={"nav_logo"}
              id={"w-node-_3f0395f7-889c-390a-07ca-0ee21a48b2cd-3bb61a75"}
              options={{
                href: "#",
              }}
            >
              <Block className={"nav_logo-icon"} tag={"div"}>
                <DOM
                  height={"100%"}
                  preserveAspectRatio={"xMidYMid meet"}
                  slot={""}
                  tag={"svg"}
                  viewBox={"0 0 33 33"}
                  width={"100%"}
                >
                  <DOM
                    d={
                      "M28,0H5C2.24,0,0,2.24,0,5v23c0,2.76,2.24,5,5,5h23c2.76,0,5-2.24,5-5V5c0-2.76-2.24-5-5-5ZM29,17c-6.63,0-12,5.37-12,12h-1c0-6.63-5.37-12-12-12v-1c6.63,0,12-5.37,12-12h1c0,6.63,5.37,12,12,12v1Z"
                    }
                    fill={"currentColor"}
                    slot={""}
                    tag={"path"}
                  />
                </DOM>
              </Block>
              <Block
                className={"paragraph_large margin-bottom_none"}
                data-brand-name={"true"}
                tag={"div"}
              >
                {"HomePro Marketing"}
              </Block>
            </Link>
          </Block>
          <Block
            className={"nav_right"}
            id={"w-node-_3f0395f7-889c-390a-07ca-0ee21a48b377-3bb61a75"}
            tag={"div"}
          >
            <NavbarMenu
              className={"nav_menu"}
              id={"w-node-_3f0395f7-889c-390a-07ca-0ee21a48b372-3bb61a75"}
              role={"navigation"}
              tag={"nav"}
            >
              <List
                className={"nav_menu-list"}
                role={"list"}
                tag={"ul"}
                unstyled={true}
              >
                <ListItem className={"nav_menu-list-item"}>
                  <DropdownWrapper
                    className={"nav_dropdown-menu"}
                    delay={0}
                    hover={false}
                    tag={"div"}
                  >
                    <DropdownToggle
                      className={"nav_link on-inverse"}
                      tag={"div"}
                    >
                      <Block tag={"div"}>{"Services"}</Block>
                      <Icon
                        className={"nav_caret"}
                        widget={{
                          type: "icon",
                          icon: "dropdown-toggle",
                        }}
                      />
                    </DropdownToggle>
                    <DropdownList
                      className={"mega-nav_dropdown-list"}
                      tag={"nav"}
                    >
                      <Block
                        className={"mega-nav_dropdown-list-wrapper"}
                        tag={"div"}
                      >
                        <List
                          className={
                            "grid_3-col tablet-1-col-1 gap-medium margin-bottom_none"
                          }
                          role={"list"}
                          tag={"ul"}
                          unstyled={true}
                        >
                          <ListItem
                            className={
                              "w-node-_3f0395f7-889c-390a-07ca-0ee21a48b343-3bb61a75"
                            }
                            id={
                              "w-node-_016f5a0a-5b63-edde-82c5-e2b2ad6d2e6d-ad6d2e56"
                            }
                          >
                            <Grid
                              className={"grid_3-col tablet-1-col-1 gap-small"}
                            >
                              <Block tag={"div"}>
                                <Block className={"eyebrow"} tag={"div"}>
                                  {"Lead Generation"}
                                </Block>
                                <List
                                  className={"mega-nav_list"}
                                  role={"list"}
                                  tag={"ul"}
                                  unstyled={true}
                                >
                                  <ListItem
                                    className={"margin-bottom_none"}
                                    id={
                                      "w-node-_3f0395f7-889c-390a-07ca-0ee21a48b2df-3bb61a75"
                                    }
                                  >
                                    <Link
                                      block={"inline"}
                                      button={false}
                                      className={"mega-nav_link-item"}
                                      options={{
                                        href: "#",
                                      }}
                                    >
                                      <Block
                                        className={"icon is-medium on-inverse"}
                                        tag={"div"}
                                      >
                                        <DOM
                                          fill={"currentColor"}
                                          height={"100%"}
                                          slot={""}
                                          tag={"svg"}
                                          viewBox={"0 0 32 32"}
                                          width={"100%"}
                                          xmlns={"http://www.w3.org/2000/svg"}
                                        >
                                          <DOM
                                            d={
                                              "m25.7 9.3l-7-7A.9.9 0 0 0 18 2H8a2.006 2.006 0 0 0-2 2v24a2.006 2.006 0 0 0 2 2h16a2.006 2.006 0 0 0 2-2V10a.9.9 0 0 0-.3-.7M18 4.4l5.6 5.6H18ZM24 28H8V4h8v6a2.006 2.006 0 0 0 2 2h6Z"
                                            }
                                            slot={""}
                                            stroke-linejoin={"round"}
                                            tag={"path"}
                                          />
                                        </DOM>
                                      </Block>
                                      <Block
                                        className={
                                          "w-node-_3f0395f7-889c-390a-07ca-0ee21a48b2dd-3bb61a75"
                                        }
                                        id={
                                          "w-node-_016f5a0a-5b63-edde-82c5-e2b2ad6d2e78-ad6d2e56"
                                        }
                                        tag={"div"}
                                      >
                                        <Block tag={"div"}>
                                          <Strong>{"SEO Campaigns"}</Strong>
                                        </Block>
                                        <Block
                                          className={
                                            "paragraph_small text-color_secondary"
                                          }
                                          tag={"div"}
                                        >
                                          {
                                            "Drive qualified leads to your business."
                                          }
                                        </Block>
                                      </Block>
                                    </Link>
                                  </ListItem>
                                  <ListItem
                                    className={"margin-bottom_none"}
                                    id={
                                      "w-node-_3f0395f7-889c-390a-07ca-0ee21a48b2ea-3bb61a75"
                                    }
                                  >
                                    <Link
                                      block={"inline"}
                                      button={false}
                                      className={"mega-nav_link-item"}
                                      options={{
                                        href: "#",
                                      }}
                                    >
                                      <Block
                                        className={"icon is-medium on-inverse"}
                                        tag={"div"}
                                      >
                                        <DOM
                                          fill={"currentColor"}
                                          height={"100%"}
                                          slot={""}
                                          tag={"svg"}
                                          viewBox={"0 0 32 32"}
                                          width={"100%"}
                                          xmlns={"http://www.w3.org/2000/svg"}
                                        >
                                          <DOM
                                            d={
                                              "m25.7 9.3l-7-7A.9.9 0 0 0 18 2H8a2.006 2.006 0 0 0-2 2v24a2.006 2.006 0 0 0 2 2h16a2.006 2.006 0 0 0 2-2V10a.9.9 0 0 0-.3-.7M18 4.4l5.6 5.6H18ZM24 28H8V4h8v6a2.006 2.006 0 0 0 2 2h6Z"
                                            }
                                            slot={""}
                                            stroke-linejoin={"round"}
                                            tag={"path"}
                                          />
                                        </DOM>
                                      </Block>
                                      <Block
                                        className={
                                          "w-node-_3f0395f7-889c-390a-07ca-0ee21a48b2e8-3bb61a75"
                                        }
                                        id={
                                          "w-node-f807f6d1-1643-a581-cf58-1ddfb132bd6d-ad6d2e56"
                                        }
                                        tag={"div"}
                                      >
                                        <Block tag={"div"}>
                                          <Strong>{"Paid Advertising"}</Strong>
                                        </Block>
                                        <Block
                                          className={
                                            "paragraph_small text-color_secondary"
                                          }
                                          tag={"div"}
                                        >
                                          {"Maximize ROI with targeted ads."}
                                        </Block>
                                      </Block>
                                    </Link>
                                  </ListItem>
                                  <ListItem
                                    className={"margin-bottom_none"}
                                    id={
                                      "w-node-_3f0395f7-889c-390a-07ca-0ee21a48b2f5-3bb61a75"
                                    }
                                  >
                                    <Link
                                      block={"inline"}
                                      button={false}
                                      className={"mega-nav_link-item"}
                                      options={{
                                        href: "#",
                                      }}
                                    >
                                      <Block
                                        className={"icon is-medium on-inverse"}
                                        tag={"div"}
                                      >
                                        <DOM
                                          fill={"currentColor"}
                                          height={"100%"}
                                          slot={""}
                                          tag={"svg"}
                                          viewBox={"0 0 32 32"}
                                          width={"100%"}
                                          xmlns={"http://www.w3.org/2000/svg"}
                                        >
                                          <DOM
                                            d={
                                              "m25.7 9.3l-7-7A.9.9 0 0 0 18 2H8a2.006 2.006 0 0 0-2 2v24a2.006 2.006 0 0 0 2 2h16a2.006 2.006 0 0 0 2-2V10a.9.9 0 0 0-.3-.7M18 4.4l5.6 5.6H18ZM24 28H8V4h8v6a2.006 2.006 0 0 0 2 2h6Z"
                                            }
                                            slot={""}
                                            stroke-linejoin={"round"}
                                            tag={"path"}
                                          />
                                        </DOM>
                                      </Block>
                                      <Block
                                        className={
                                          "w-node-_3f0395f7-889c-390a-07ca-0ee21a48b2f3-3bb61a75"
                                        }
                                        id={
                                          "w-node-_81a98210-c6c4-fcf3-e0c3-108b18c0cc9b-ad6d2e56"
                                        }
                                        tag={"div"}
                                      >
                                        <Block tag={"div"}>
                                          <Strong>{"Website Design"}</Strong>
                                        </Block>
                                        <Block
                                          className={
                                            "paragraph_small text-color_secondary"
                                          }
                                          tag={"div"}
                                        >
                                          {
                                            "Modern, conversion-focused websites."
                                          }
                                        </Block>
                                      </Block>
                                    </Link>
                                  </ListItem>
                                </List>
                              </Block>
                              <Block
                                id={
                                  "w-node-_3f0395f7-889c-390a-07ca-0ee21a48b31c-3bb61a75"
                                }
                                tag={"div"}
                              >
                                <Block className={"eyebrow"} tag={"div"}>
                                  {"Digital Strategy"}
                                </Block>
                                <List
                                  className={"mega-nav_list"}
                                  role={"list"}
                                  tag={"ul"}
                                  unstyled={true}
                                >
                                  <ListItem
                                    className={"margin-bottom_none"}
                                    id={
                                      "w-node-_3f0395f7-889c-390a-07ca-0ee21a48b304-3bb61a75"
                                    }
                                  >
                                    <Link
                                      block={"inline"}
                                      button={false}
                                      className={"mega-nav_link-item"}
                                      options={{
                                        href: "#",
                                      }}
                                    >
                                      <Block
                                        className={"icon is-medium on-inverse"}
                                        tag={"div"}
                                      >
                                        <DOM
                                          fill={"currentColor"}
                                          height={"100%"}
                                          slot={""}
                                          tag={"svg"}
                                          viewBox={"0 0 32 32"}
                                          width={"100%"}
                                          xmlns={"http://www.w3.org/2000/svg"}
                                        >
                                          <DOM
                                            d={
                                              "m25.7 9.3l-7-7A.9.9 0 0 0 18 2H8a2.006 2.006 0 0 0-2 2v24a2.006 2.006 0 0 0 2 2h16a2.006 2.006 0 0 0 2-2V10a.9.9 0 0 0-.3-.7M18 4.4l5.6 5.6H18ZM24 28H8V4h8v6a2.006 2.006 0 0 0 2 2h6Z"
                                            }
                                            slot={""}
                                            stroke-linejoin={"round"}
                                            tag={"path"}
                                          />
                                        </DOM>
                                      </Block>
                                      <Block
                                        className={
                                          "w-node-_3f0395f7-889c-390a-07ca-0ee21a48b302-3bb61a75"
                                        }
                                        id={
                                          "w-node-_9f30640f-1f64-d0c6-60e9-e2b460cf1f47-ad6d2e56"
                                        }
                                        tag={"div"}
                                      >
                                        <Block tag={"div"}>
                                          <Strong>{"Consulting"}</Strong>
                                        </Block>
                                        <Block
                                          className={
                                            "paragraph_small text-color_secondary"
                                          }
                                          tag={"div"}
                                        >
                                          {"Expert advice for growth."}
                                        </Block>
                                      </Block>
                                    </Link>
                                  </ListItem>
                                  <ListItem
                                    className={"margin-bottom_none"}
                                    id={
                                      "w-node-_3f0395f7-889c-390a-07ca-0ee21a48b30f-3bb61a75"
                                    }
                                  >
                                    <Link
                                      block={"inline"}
                                      button={false}
                                      className={"mega-nav_link-item"}
                                      options={{
                                        href: "#",
                                      }}
                                    >
                                      <Block
                                        className={"icon is-medium on-inverse"}
                                        tag={"div"}
                                      >
                                        <DOM
                                          fill={"currentColor"}
                                          height={"100%"}
                                          slot={""}
                                          tag={"svg"}
                                          viewBox={"0 0 32 32"}
                                          width={"100%"}
                                          xmlns={"http://www.w3.org/2000/svg"}
                                        >
                                          <DOM
                                            d={
                                              "m25.7 9.3l-7-7A.9.9 0 0 0 18 2H8a2.006 2.006 0 0 0-2 2v24a2.006 2.006 0 0 0 2 2h16a2.006 2.006 0 0 0 2-2V10a.9.9 0 0 0-.3-.7M18 4.4l5.6 5.6H18ZM24 28H8V4h8v6a2.006 2.006 0 0 0 2 2h6Z"
                                            }
                                            slot={""}
                                            stroke-linejoin={"round"}
                                            tag={"path"}
                                          />
                                        </DOM>
                                      </Block>
                                      <Block
                                        className={
                                          "w-node-_3f0395f7-889c-390a-07ca-0ee21a48b30d-3bb61a75"
                                        }
                                        id={
                                          "w-node-_9f30640f-1f64-d0c6-60e9-e2b460cf1f52-ad6d2e56"
                                        }
                                        tag={"div"}
                                      >
                                        <Block tag={"div"}>
                                          <Strong>{"Branding"}</Strong>
                                        </Block>
                                        <Block
                                          className={
                                            "paragraph_small text-color_secondary"
                                          }
                                          tag={"div"}
                                        >
                                          {"Build a trusted reputation."}
                                        </Block>
                                      </Block>
                                    </Link>
                                  </ListItem>
                                  <ListItem
                                    className={"margin-bottom_none"}
                                    id={
                                      "w-node-_3f0395f7-889c-390a-07ca-0ee21a48b31a-3bb61a75"
                                    }
                                  >
                                    <Link
                                      block={"inline"}
                                      button={false}
                                      className={"mega-nav_link-item"}
                                      options={{
                                        href: "#",
                                      }}
                                    >
                                      <Block
                                        className={"icon is-medium on-inverse"}
                                        tag={"div"}
                                      >
                                        <DOM
                                          fill={"currentColor"}
                                          height={"100%"}
                                          slot={""}
                                          tag={"svg"}
                                          viewBox={"0 0 32 32"}
                                          width={"100%"}
                                          xmlns={"http://www.w3.org/2000/svg"}
                                        >
                                          <DOM
                                            d={
                                              "m25.7 9.3l-7-7A.9.9 0 0 0 18 2H8a2.006 2.006 0 0 0-2 2v24a2.006 2.006 0 0 0 2 2h16a2.006 2.006 0 0 0 2-2V10a.9.9 0 0 0-.3-.7M18 4.4l5.6 5.6H18ZM24 28H8V4h8v6a2.006 2.006 0 0 0 2 2h6Z"
                                            }
                                            slot={""}
                                            stroke-linejoin={"round"}
                                            tag={"path"}
                                          />
                                        </DOM>
                                      </Block>
                                      <Block
                                        className={
                                          "w-node-_3f0395f7-889c-390a-07ca-0ee21a48b318-3bb61a75"
                                        }
                                        id={
                                          "w-node-_9f30640f-1f64-d0c6-60e9-e2b460cf1f5d-ad6d2e56"
                                        }
                                        tag={"div"}
                                      >
                                        <Block tag={"div"}>
                                          <Strong>{"Analytics"}</Strong>
                                        </Block>
                                        <Block
                                          className={
                                            "paragraph_small text-color_secondary"
                                          }
                                          tag={"div"}
                                        >
                                          {"Track and optimize results."}
                                        </Block>
                                      </Block>
                                    </Link>
                                  </ListItem>
                                </List>
                              </Block>
                              <Block
                                id={
                                  "w-node-_3f0395f7-889c-390a-07ca-0ee21a48b341-3bb61a75"
                                }
                                tag={"div"}
                              >
                                <Block className={"eyebrow"} tag={"div"}>
                                  {"Support"}
                                </Block>
                                <List
                                  className={"mega-nav_list"}
                                  role={"list"}
                                  tag={"ul"}
                                  unstyled={true}
                                >
                                  <ListItem
                                    className={"margin-bottom_none"}
                                    id={
                                      "w-node-_3f0395f7-889c-390a-07ca-0ee21a48b329-3bb61a75"
                                    }
                                  >
                                    <Link
                                      block={"inline"}
                                      button={false}
                                      className={"mega-nav_link-item"}
                                      options={{
                                        href: "#",
                                      }}
                                    >
                                      <Block
                                        className={"icon is-medium on-inverse"}
                                        tag={"div"}
                                      >
                                        <DOM
                                          fill={"currentColor"}
                                          height={"100%"}
                                          slot={""}
                                          tag={"svg"}
                                          viewBox={"0 0 32 32"}
                                          width={"100%"}
                                          xmlns={"http://www.w3.org/2000/svg"}
                                        >
                                          <DOM
                                            d={
                                              "m25.7 9.3l-7-7A.9.9 0 0 0 18 2H8a2.006 2.006 0 0 0-2 2v24a2.006 2.006 0 0 0 2 2h16a2.006 2.006 0 0 0 2-2V10a.9.9 0 0 0-.3-.7M18 4.4l5.6 5.6H18ZM24 28H8V4h8v6a2.006 2.006 0 0 0 2 2h6Z"
                                            }
                                            slot={""}
                                            stroke-linejoin={"round"}
                                            tag={"path"}
                                          />
                                        </DOM>
                                      </Block>
                                      <Block
                                        className={
                                          "w-node-_3f0395f7-889c-390a-07ca-0ee21a48b327-3bb61a75"
                                        }
                                        id={
                                          "w-node-_246168ec-5422-2d22-c1a6-e8b7eb4d77d8-ad6d2e56"
                                        }
                                        tag={"div"}
                                      >
                                        <Block tag={"div"}>
                                          <Strong>{"Help Center"}</Strong>
                                        </Block>
                                        <Block
                                          className={
                                            "paragraph_small text-color_secondary"
                                          }
                                          tag={"div"}
                                        >
                                          {"Find answers to common questions."}
                                        </Block>
                                      </Block>
                                    </Link>
                                  </ListItem>
                                  <ListItem
                                    className={"margin-bottom_none"}
                                    id={
                                      "w-node-_3f0395f7-889c-390a-07ca-0ee21a48b334-3bb61a75"
                                    }
                                  >
                                    <Link
                                      block={"inline"}
                                      button={false}
                                      className={"mega-nav_link-item"}
                                      options={{
                                        href: "#",
                                      }}
                                    >
                                      <Block
                                        className={"icon is-medium on-inverse"}
                                        tag={"div"}
                                      >
                                        <DOM
                                          fill={"currentColor"}
                                          height={"100%"}
                                          slot={""}
                                          tag={"svg"}
                                          viewBox={"0 0 32 32"}
                                          width={"100%"}
                                          xmlns={"http://www.w3.org/2000/svg"}
                                        >
                                          <DOM
                                            d={
                                              "m25.7 9.3l-7-7A.9.9 0 0 0 18 2H8a2.006 2.006 0 0 0-2 2v24a2.006 2.006 0 0 0 2 2h16a2.006 2.006 0 0 0 2-2V10a.9.9 0 0 0-.3-.7M18 4.4l5.6 5.6H18ZM24 28H8V4h8v6a2.006 2.006 0 0 0 2 2h6Z"
                                            }
                                            slot={""}
                                            stroke-linejoin={"round"}
                                            tag={"path"}
                                          />
                                        </DOM>
                                      </Block>
                                      <Block
                                        className={
                                          "w-node-_3f0395f7-889c-390a-07ca-0ee21a48b332-3bb61a75"
                                        }
                                        id={
                                          "w-node-_246168ec-5422-2d22-c1a6-e8b7eb4d77e3-ad6d2e56"
                                        }
                                        tag={"div"}
                                      >
                                        <Block tag={"div"}>
                                          <Strong>{"Contact"}</Strong>
                                        </Block>
                                        <Block
                                          className={
                                            "paragraph_small text-color_secondary"
                                          }
                                          tag={"div"}
                                        >
                                          {"Get in touch with our team."}
                                        </Block>
                                      </Block>
                                    </Link>
                                  </ListItem>
                                  <ListItem
                                    className={"margin-bottom_none"}
                                    id={
                                      "w-node-_3f0395f7-889c-390a-07ca-0ee21a48b33f-3bb61a75"
                                    }
                                  >
                                    <Link
                                      block={"inline"}
                                      button={false}
                                      className={"mega-nav_link-item"}
                                      options={{
                                        href: "#",
                                      }}
                                    >
                                      <Block
                                        className={"icon is-medium on-inverse"}
                                        tag={"div"}
                                      >
                                        <DOM
                                          fill={"currentColor"}
                                          height={"100%"}
                                          slot={""}
                                          tag={"svg"}
                                          viewBox={"0 0 32 32"}
                                          width={"100%"}
                                          xmlns={"http://www.w3.org/2000/svg"}
                                        >
                                          <DOM
                                            d={
                                              "m25.7 9.3l-7-7A.9.9 0 0 0 18 2H8a2.006 2.006 0 0 0-2 2v24a2.006 2.006 0 0 0 2 2h16a2.006 2.006 0 0 0 2-2V10a.9.9 0 0 0-.3-.7M18 4.4l5.6 5.6H18ZM24 28H8V4h8v6a2.006 2.006 0 0 0 2 2h6Z"
                                            }
                                            slot={""}
                                            stroke-linejoin={"round"}
                                            tag={"path"}
                                          />
                                        </DOM>
                                      </Block>
                                      <Block
                                        className={
                                          "w-node-_3f0395f7-889c-390a-07ca-0ee21a48b33d-3bb61a75"
                                        }
                                        id={
                                          "w-node-_246168ec-5422-2d22-c1a6-e8b7eb4d77ee-ad6d2e56"
                                        }
                                        tag={"div"}
                                      >
                                        <Block tag={"div"}>
                                          <Strong>{"Resources"}</Strong>
                                        </Block>
                                        <Block
                                          className={
                                            "paragraph_small text-color_secondary"
                                          }
                                          tag={"div"}
                                        >
                                          {"Guides and marketing tips."}
                                        </Block>
                                      </Block>
                                    </Link>
                                  </ListItem>
                                </List>
                              </Block>
                            </Grid>
                          </ListItem>
                          <ListItem
                            className={
                              "flex_horizontal w-node-_3f0395f7-889c-390a-07ca-0ee21a48b352-3bb61a75"
                            }
                            id={
                              "w-node-_016f5a0a-5b63-edde-82c5-e2b2ad6d2ede-ad6d2e56"
                            }
                          >
                            <Link
                              block={"inline"}
                              button={false}
                              className={
                                "card-link is-inverse flex-child_expand on-inverse"
                              }
                              options={{
                                href: "#",
                              }}
                            >
                              <Block className={"card_body"} tag={"div"}>
                                <Block
                                  className={"heading_tertiary"}
                                  tag={"div"}
                                >
                                  {"Book your free strategy call"}
                                </Block>
                                <Paragraph
                                  className={
                                    "paragraph_small text-color_inverse-secondary"
                                  }
                                >
                                  {
                                    "Schedule a call to discuss your goals and get a tailored marketing plan."
                                  }
                                </Paragraph>
                                <Block
                                  className={"margin_top-auto"}
                                  tag={"div"}
                                >
                                  <Block className={"button-group"} tag={"div"}>
                                    <Block
                                      className={
                                        "text-button is-secondary on-inverse"
                                      }
                                      tag={"div"}
                                    >
                                      <Block tag={"div"}>{"Book now"}</Block>
                                      <Block
                                        className={"button_icon"}
                                        tag={"div"}
                                      >
                                        <DOM
                                          fill={"none"}
                                          height={"100%"}
                                          slot={""}
                                          tag={"svg"}
                                          viewBox={"0 0 16 16"}
                                          width={"100%"}
                                          xmlns={"http://www.w3.org/2000/svg"}
                                        >
                                          <DOM
                                            d={
                                              "M2 8H14.5M14.5 8L8.5 2M14.5 8L8.5 14"
                                            }
                                            slot={""}
                                            stroke={"currentColor"}
                                            stroke-linejoin={"round"}
                                            stroke-width={"2"}
                                            tag={"path"}
                                          />
                                        </DOM>
                                      </Block>
                                    </Block>
                                  </Block>
                                </Block>
                              </Block>
                            </Link>
                          </ListItem>
                        </List>
                      </Block>
                    </DropdownList>
                  </DropdownWrapper>
                </ListItem>
                <ListItem className={"nav_menu-list-item"}>
                  <Link
                    block={"inline"}
                    button={false}
                    className={"nav_link on-inverse"}
                    options={{
                      href: "#",
                    }}
                  >
                    <Block tag={"div"}>{"About"}</Block>
                  </Link>
                </ListItem>
                <ListItem className={"nav_menu-list-item"}>
                  <Link
                    block={"inline"}
                    button={false}
                    className={"nav_link on-inverse"}
                    options={{
                      href: "#",
                    }}
                  >
                    <Block tag={"div"}>{"Blog"}</Block>
                  </Link>
                </ListItem>
                <ListItem className={"nav_menu-list-item"}>
                  <DropdownWrapper
                    className={"nav_dropdown-menu"}
                    delay={0}
                    hover={false}
                    tag={"div"}
                  >
                    <DropdownToggle
                      className={"nav_link on-inverse"}
                      tag={"div"}
                    >
                      <Block tag={"div"}>{"Support"}</Block>
                      <Icon
                        className={"nav_caret"}
                        widget={{
                          type: "icon",
                          icon: "dropdown-toggle",
                        }}
                      />
                    </DropdownToggle>
                    <DropdownList className={"nav_dropdown-list-1"} tag={"div"}>
                      <Block
                        className={"nav-menu_dropdown-list-wrapper"}
                        tag={"div"}
                      >
                        <List
                          className={"flex_vertical margin-bottom_none"}
                          role={"list"}
                          tag={"ul"}
                          unstyled={true}
                        >
                          <ListItem className={"margin-bottom_none"}>
                            <Link
                              block={"inline"}
                              button={false}
                              className={"nav_dropdown-link"}
                              options={{
                                href: "#",
                              }}
                            >
                              <Block className={"button_label"} tag={"div"}>
                                {"Help Center"}
                              </Block>
                            </Link>
                          </ListItem>
                          <ListItem className={"margin-bottom_none"}>
                            <Link
                              block={"inline"}
                              button={false}
                              className={"nav_dropdown-link"}
                              options={{
                                href: "#",
                              }}
                            >
                              <Block className={"button_label"} tag={"div"}>
                                {"Contact"}
                              </Block>
                            </Link>
                          </ListItem>
                        </List>
                      </Block>
                    </DropdownList>
                  </DropdownWrapper>
                </ListItem>
              </List>
            </NavbarMenu>
            <Block className={"button-group margin-top_none"} tag={"div"}>
              <Link
                block={"inline"}
                button={false}
                className={"button on-inverse"}
                options={{
                  href: "#",
                }}
              >
                <Block className={"button_label"} tag={"div"}>
                  {"Book appointment"}
                </Block>
              </Link>
            </Block>
          </Block>
          <NavbarButton className={"nav_mobile-menu-button"} tag={"div"}>
            <Block className={"icon on-inverse"} tag={"div"}>
              <DOM
                height={"24"}
                slot={""}
                tag={"svg"}
                viewBox={"0 0 24 24"}
                width={"24"}
                xmlns={"http://www.w3.org/2000/svg"}
              >
                <DOM
                  class={"nc-icon-wrapper"}
                  fill={"none"}
                  slot={""}
                  stroke={"currentColor"}
                  stroke-linecap={"square"}
                  stroke-linejoin={"miter"}
                  stroke-miterlimit={"10"}
                  stroke-width={"1.5"}
                  tag={"g"}
                >
                  <DOM
                    slot={""}
                    stroke={"currentColor"}
                    tag={"line"}
                    x1={"1"}
                    x2={"23"}
                    y1={"12"}
                    y2={"12"}
                  />
                  <DOM
                    slot={""}
                    tag={"line"}
                    x1={"1"}
                    x2={"23"}
                    y1={"5"}
                    y2={"5"}
                  />
                  <DOM
                    slot={""}
                    tag={"line"}
                    x1={"1"}
                    x2={"23"}
                    y1={"19"}
                    y2={"19"}
                  />
                </DOM>
              </DOM>
            </Block>
          </NavbarButton>
        </NavbarWrapper>
      </Block>
    </div>
  );
}
