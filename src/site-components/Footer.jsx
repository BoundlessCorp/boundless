"use client";
import React from "react";
import { DEVLINK_SCOPE_CLASS } from "./devlinkScope";
import Block from "./webflow_modules/Basic/components/Block";
import DOM from "./webflow_modules/Builtin/components/DOM";
import FormBlockLabel from "./webflow_modules/Form/components/FormBlockLabel";
import FormButton from "./webflow_modules/Form/components/FormButton";
import FormErrorMessage from "./webflow_modules/Form/components/FormErrorMessage";
import FormForm from "./webflow_modules/Form/components/FormForm";
import FormSuccessMessage from "./webflow_modules/Form/components/FormSuccessMessage";
import FormTextInput from "./webflow_modules/Form/components/FormTextInput";
import FormWrapper from "./webflow_modules/Form/components/FormWrapper";
import Grid from "./webflow_modules/Layout/components/Grid";
import Heading from "./webflow_modules/Basic/components/Heading";
import Link from "./webflow_modules/Basic/components/Link";
import List from "./webflow_modules/Basic/components/List";
import ListItem from "./webflow_modules/Basic/components/ListItem";
import Paragraph from "./webflow_modules/Basic/components/Paragraph";
import Section from "./webflow_modules/Layout/components/Section";

export function Footer({}) {
  return (
    <div
      className={DEVLINK_SCOPE_CLASS}
      style={{
        display: "contents",
      }}
    >
      <Section className={"footer is-inverse"} tag={"footer"}>
        <Block className={"container"} tag={"div"}>
          <Grid className={"grid_2-col mobile-l-1-col gap-medium"}>
            <Block
              className={
                "flex_vertical is_space-between gap-medium w-node-_3f0395f7-889c-390a-07ca-0ee21a48b395-3bb61a76"
              }
              id={"w-node-eb280a5f-22b8-2fbd-d63f-a45e5168e138-5168e135"}
              tag={"div"}
            >
              <List
                className={"margin-bottom_small"}
                role={"list"}
                tag={"ul"}
                unstyled={true}
              >
                <ListItem>
                  <Link
                    block={"inline"}
                    button={false}
                    className={"footer_link on-inverse"}
                    options={{
                      href: "#",
                    }}
                  >
                    <Block tag={"div"}>{"info@homepromarketing.com"}</Block>
                  </Link>
                </ListItem>
                <ListItem>
                  <Link
                    block={"inline"}
                    button={false}
                    className={"footer_link on-inverse"}
                    options={{
                      href: "#",
                    }}
                  >
                    <Block tag={"div"}>{"Dribbble"}</Block>
                  </Link>
                </ListItem>
                <ListItem>
                  <Link
                    block={"inline"}
                    button={false}
                    className={"footer_link on-inverse"}
                    options={{
                      href: "#",
                    }}
                  >
                    <Block tag={"div"}>{"LinkedIn"}</Block>
                  </Link>
                </ListItem>
              </List>
              <Block
                className={"ix-link-wrapper"}
                id={"w-node-_3f0395f7-889c-390a-07ca-0ee21a48b394-3bb61a76"}
                tag={"div"}
              >
                <Link
                  block={"inline"}
                  button={false}
                  className={"logo-link"}
                  id={"w-node-_3f0395f7-889c-390a-07ca-0ee21a48b393-3bb61a76"}
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
                    className={
                      "paragraph_xlarge margin-bottom_none text_all-caps"
                    }
                    data-brand-name={"true"}
                    tag={"div"}
                  >
                    {"HomePro Marketing"}
                  </Block>
                </Link>
              </Block>
            </Block>
            <Block
              className={
                "flex_vertical w-node-_3f0395f7-889c-390a-07ca-0ee21a48b3af-3bb61a76"
              }
              id={"w-node-eb280a5f-22b8-2fbd-d63f-a45e5168e14a-5168e135"}
              tag={"div"}
            >
              <Heading className={"heading_tertiary"} tag={"h2"}>
                {"Stay informed"}
              </Heading>
              <Paragraph className={"margin-bottom_xsmall"}>
                {"Subscribe for marketing insights and updates."}
              </Paragraph>
              <FormWrapper
                className={
                  "margin-bottom_none width_100percent margin_top-auto"
                }
              >
                <FormForm
                  className={
                    "flex_horizontal gap-xsmall flex_vertical_mobile-l"
                  }
                  data-name={"Subscribe"}
                  data-wf-element-id={"ffe74312-a8c7-91cb-d03a-b0d7e7465b39"}
                  data-wf-page-id={""}
                  id={"wf-form-Subscribe"}
                  method={"get"}
                  name={"wf-form-Subscribe"}
                >
                  <Block
                    className={"form_item margin-bottom_none flex-child_expand"}
                    tag={"div"}
                  >
                    <FormBlockLabel
                      className={"input_label screen-reader"}
                      htmlFor={"subscribe-email-2"}
                    >
                      {"Email"}
                    </FormBlockLabel>
                    <FormTextInput
                      autoFocus={false}
                      className={"input_field on-inverse"}
                      data-name={"Email 2"}
                      disabled={false}
                      id={"subscribe-email"}
                      maxLength={256}
                      name={"email-2"}
                      placeholder={"Email"}
                      required={true}
                      type={"email"}
                    />
                  </Block>
                  <Block className={"ix-link-wrapper"} tag={"div"}>
                    <FormButton
                      className={"button on-inverse"}
                      data-wait={"Please wait..."}
                      role={"button"}
                      type={"submit"}
                      value={"Subscribe"}
                    />
                  </Block>
                </FormForm>
                <Paragraph
                  className={
                    "paragraph_small margin-top_xsmall margin-bottom_none"
                  }
                >
                  {"View our "}
                  <Link
                    block={""}
                    button={false}
                    className={
                      "text-link is-secondary text-span_padding on-inverse"
                    }
                    options={{
                      href: "#",
                    }}
                  >
                    {"privacy policy"}
                  </Link>
                  {" for details."}
                </Paragraph>
                <FormSuccessMessage className={"footer_form_success-message"}>
                  <Block tag={"div"}>
                    {"Success! You"}
                    {"’"}
                    {"re on our list."}
                  </Block>
                </FormSuccessMessage>
                <FormErrorMessage>
                  <Block tag={"div"}>{"Error. Please try again."}</Block>
                </FormErrorMessage>
              </FormWrapper>
            </Block>
          </Grid>
          <Block
            className={"divider margin-top_small margin-bottom_small"}
            tag={"div"}
          />
          <Block className={"footer_bottom"} tag={"div"}>
            <Block className={"text-color_secondary"} tag={"div"}>
              {"All rights reserved "}
              {"©"}
              {" 2025"}
            </Block>
            <Block className={"text-color_secondary"} tag={"div"}>
              {"Made by Taylor Brooks"}
            </Block>
          </Block>
        </Block>
      </Section>
    </div>
  );
}
