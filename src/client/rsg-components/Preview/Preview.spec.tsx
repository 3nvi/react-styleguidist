import React from 'react';
import { mount } from 'enzyme';
import { render } from '@testing-library/react';
import Preview from '.';
import Context, { StyleGuideContextContents } from '../Context';
import config from '../../../scripts/schemas/config';

const compileExample = config.compileExample.default;

/* eslint-disable no-console */

const code = 'import React from "react"; <button>Code: OK</button>';
const newCode = 'import React from "react"; <button>Code: Cancel</button>';

const defaultProps = {
	code,
	documentScope: {},
	exampleScope: { react: React },
};

const context = {
	config: {
		compileExample,
	},
	codeRevision: 0,
} as StyleGuideContextContents;

const Provider = (props: Record<string, unknown>) => (
	<Context.Provider value={context} {...props} />
);

const console$error = console.error;
const console$clear = console.clear;

afterEach(() => {
	console.error = console$error;
	console.clear = console$clear;
});

it('should unmount Wrapper component', () => {
	const { unmount, getByTestId } = render(
		<Provider>
			<Preview {...defaultProps} />
		</Provider>
	);

	const node = getByTestId('mountNode');

	expect(node.innerHTML).toMatch('<button');
	unmount();
	expect(node.innerHTML).toBe('');
});

it('should not fail when Wrapper wasn’t mounted', () => {
	const consoleError = jest.fn();
	console.error = consoleError;

	const { unmount, getByTestId } = render(
		<Provider>
			<Preview {...defaultProps} code="pizza" />
		</Provider>
	);

	const node = getByTestId('mountNode');

	expect(
		consoleError.mock.calls.find((call) =>
			call[0].toString().includes('ReferenceError: pizza is not defined')
		)
	).toBeTruthy();

	expect(node.innerHTML).toBe('');
	unmount();
	expect(node.innerHTML).toBe('');
});

it('should update', () => {
	const { rerender, getByText } = render(
		<Provider>
			<Preview {...defaultProps} />
		</Provider>
	);

	expect(getByText('Code: OK')).toBeInTheDocument();

	rerender(
		<Provider>
			<Preview {...defaultProps} code={newCode} />
		</Provider>
	);

	expect(getByText('Code: Cancel')).toBeInTheDocument();
});

it('should handle no code', () => {
	console.error = jest.fn();
	render(
		<Provider>
			<Preview {...defaultProps} code="" />
		</Provider>
	);

	expect(console.error).not.toHaveBeenCalled();
});

it('should handle errors', () => {
	const consoleError = jest.fn();

	console.error = consoleError;
	render(
		<Provider>
			<Preview {...defaultProps} code={'<invalid code'} />
		</Provider>
	);

	expect(
		consoleError.mock.calls.find((call) =>
			call[0].toString().includes('SyntaxError: Unexpected token')
		)
	).toBeTruthy();
});

it('should not clear console on initial mount', () => {
	console.clear = jest.fn();
	mount(
		<Provider>
			<Preview {...defaultProps} code={code} />
		</Provider>
	);
	expect(console.clear).toHaveBeenCalledTimes(0);
});

it('should clear console on second mount', () => {
	console.clear = jest.fn();
	mount(
		<Provider value={{ ...context, codeRevision: 1 }}>
			<Preview {...defaultProps} code={code} />
		</Provider>
	);
	expect(console.clear).toHaveBeenCalledTimes(1);
});
