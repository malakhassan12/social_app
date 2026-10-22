"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import type { CurtainOptions } from "@/hooks/useCurtainTransition";
import { useTransitionContext } from "./CurtainProvider";

type CurtainLinkProps = Omit<
  ComponentProps<typeof Link>,
  "href" | "onClick"
> & {
  href: string;
  transitionOptions?: CurtainOptions;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

export function CurtainLink({
  href,
  children,
  target,
  onClick,
  replace,
  transitionOptions,
  ...linkProps
}: CurtainLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { transition, isTransitioning } = useTransitionContext();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      isTransitioning
    ) {
      return;
    }

    const destination = new URL(href, window.location.href);
    const current = new URL(window.location.href);
    const opensNewContext = target !== undefined && target !== "_self";
    const hasDownload = event.currentTarget.hasAttribute("download");
    const isSamePageAnchor =
      destination.origin === current.origin &&
      destination.pathname === pathname &&
      destination.search === current.search &&
      destination.hash !== "";

    if (
      opensNewContext ||
      hasDownload ||
      destination.origin !== current.origin ||
      isSamePageAnchor ||
      (destination.pathname === pathname &&
        destination.search === current.search)
    ) {
      return;
    }

    event.preventDefault();

    void transition(
      () => {
        if (replace) {
          router.replace(href);
        } else {
          router.push(href);
        }
      },
      {
        ...transitionOptions,
        awaitNavigation:
          destination.pathname !== pathname &&
          transitionOptions?.awaitNavigation !== false,
      },
    ).catch((error: unknown) => {
      console.error("Curtain navigation failed:", error);
    });
  };

  return (
    <Link
      {...linkProps}
      href={href}
      target={target}
      replace={replace}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}