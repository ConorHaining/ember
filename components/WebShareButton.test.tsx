// import dependencies
import React from 'react'

// import react-testing methods
import { render, fireEvent, waitFor, screen } from '@testing-library/react'

// add custom jest matchers from jest-dom
import '@testing-library/jest-dom'
import WebShareButton from './WebShareButton'

describe("<WebShareButton /> Component", () => {

    beforeEach(() => {
        global.navigator.share = jest.fn();
    });

    it("should not render when the WebShare API is not supported", () => {
        global.navigator.share = undefined;
        render(<WebShareButton tripId="123" />)

        const webShareButton = screen.queryByTestId("web-share")

        expect(webShareButton).toBe(null)
    });

    it("should render when the WebShare API is supported", () => {
        render(<WebShareButton tripId="123" />)

        const webShareButton = screen.queryByTestId("web-share")

        expect(webShareButton).not.toBe(null)
    });

    it("should try to share the payload when the button is clicked", () => {
        render(<WebShareButton tripId="123" />)

        const webShareButton = screen.queryByTestId("web-share")
        webShareButton.click();

        expect(global.navigator.share).toHaveBeenCalled();
    });

    it("should use the given trip id in the payload url", () => {
        render(<WebShareButton tripId="123" />);
        const mockPayload = {
            text: "A journey aboard Ember",
            title: "A journey aboard Ember",
            url: `http://localhost:3000/trips/123`,
        };

        const webShareButton = screen.queryByTestId("web-share")
        webShareButton.click();

        expect(global.navigator.share).toHaveBeenCalledWith(mockPayload);
    });
});