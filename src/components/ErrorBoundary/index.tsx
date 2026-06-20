import { Component, type ErrorInfo, type ReactNode } from "react";
import { type WithTranslation, withTranslation } from "react-i18next";
import { FiAlertTriangle } from "react-icons/fi";
import { Button, Center, Stack, Text, Title } from "@mantine/core";

interface State {
  error: Error | null;
}

class ErrorBoundary extends Component<
  WithTranslation & { children: ReactNode },
  State
> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  handleReload = () => window.location.reload();
  handleHome = () => {
    window.location.href = "/";
  };

  render() {
    const { error } = this.state;
    const { t, children } = this.props;

    if (!error) return children;

    return (
      <Center style={{ minHeight: "100vh", padding: "2rem" }}>
        <Stack align="center" gap="lg" maw={520}>
          <FiAlertTriangle size={64} color="var(--mantine-color-red-6)" />
          <Title order={2} ta="center">
            {t("pages.error-boundary.title")}
          </Title>
          <Text c="dimmed" ta="center">
            {t("pages.error-boundary.message")}
          </Text>
          {import.meta.env.MODE === "development" && (
            <Text
              size="xs"
              c="red"
              ta="left"
              style={{
                fontFamily: "monospace",
                whiteSpace: "pre-wrap",
                background: "var(--mantine-color-red-0)",
                padding: "0.75rem 1rem",
                borderRadius: 8,
                width: "100%",
              }}
            >
              {error.message}
            </Text>
          )}
          <Stack gap="xs" style={{ width: "100%" }} align="center">
            <Button
              onClick={this.handleReload}
              style={{ backgroundColor: "#05aac2" }}
            >
              {t("pages.error-boundary.reload")}
            </Button>
            <Button variant="subtle" onClick={this.handleHome}>
              {t("pages.error-boundary.home")}
            </Button>
          </Stack>
        </Stack>
      </Center>
    );
  }
}

export default withTranslation()(ErrorBoundary);
