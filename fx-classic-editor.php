<?php
/**
 * Plugin Name: f(x) Classic Editor Block Component
 * Description: Reuseable Gutenberg Component to easily create classic editor control.
 * Author:      turtlepod
**/

add_action( 'enqueue_block_editor_assets', function() {
	wp_enqueue_script(
		'my-blocks-editor',
		plugin_dir_url( __FILE__ ) . 'assets/js/blocks.editor.js',
		[ 'wp-i18n', 'wp-element', 'wp-blocks', 'wp-components' ],
		time()
	);
	wp_enqueue_style(
		'my-blocks-editor',
		plugin_dir_url( __FILE__ ) . 'assets/css/blocks.editor.css',
		[ 'wp-components' ],
		time()
	);
} );
