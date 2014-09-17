<?php
/*
Plugin Name: Currency_Converter
Plugin URI: https://github.com/Surendra2796
Description: Adds a currency selection widget - when the user chooses a currency, the stores prices are displayed in the chosen currency dynamically. This does not affect the currency in which you take payment. Conversions are estimated based on data from the Open Source Exchange Rates API with no guarantee whatsoever of accuracy.
Version: 1.1.0
Author: Surendra
Author URI: https://github.com/Surendra2796

	Copyright: © 2014 Surendra

*/

/**
 * Required functions
 */
if ( ! function_exists( 'woothemes_queue_update' ) )
	require_once( 'woo-includes/woo-functions.php' );

/**
 * Plugin updates
 */
woothemes_queue_update( plugin_basename( __FILE__ ), '0b2ec7cb103c9c102d37f8183924b271', '18651' );

/**
 * Check if WooCommerce is active
 **/
if ( is_woocommerce_active() ) {

	/**
	 * Localisation
	 **/
	load_plugin_textdomain('wc_currency_converter', false, dirname( plugin_basename( __FILE__ ) ) . '/');

	/**
	 * Widget
	 * */
	include_once( 'currency-converter-widget.php' );

	/**
	 * woocommerce_currency_converter class
	 **/
	if (!class_exists('WC_Currency_Converter')) {

		class WC_Currency_Converter {
			
				
			public function __construct() {

				// Init settings
				
	
				// Actions
				add_action('wp_enqueue_scripts', array( $this, 'currency_conversion_js'));
				add_action('woocommerce_checkout_update_order_meta', array( $this, 'update_order_meta'));
				add_action('widgets_init', array( $this, 'widgets'));
				add_action('wp_enqueue_scripts', array( $this, 'styles'));

				// Settings
				add_action('woocommerce_settings_general_options_after', array( $this, 'admin_settings'));
				add_action('woocommerce_update_options_general', array( $this, 'save_admin_settings'));
		    }

	        /*-----------------------------------------------------------------------------------*/
			/* Class Functions */
			/*-----------------------------------------------------------------------------------*/

			function admin_settings() {
				woocommerce_admin_fields( $this->settings );
			}

			function save_admin_settings() {
				woocommerce_update_options( $this->settings );
			}

			function widgets() {
				register_widget('WooCommerce_Widget_Currency_Converter');
			}

			function styles() {
				wp_enqueue_style( 'currency_converter_styles', plugins_url( '/assets/css/converter.css', __FILE__ ) );
			}

			function currency_conversion_js() {
				if ( is_admin() )
					return;

				// Scripts
				wp_register_script( 'Conversionjs', plugins_url('/assets/js/currencyConverter.js', __FILE__), array( 'jquery' ), '0.1.3', true );
				wp_enqueue_script( 'wc_currency_converter', plugins_url('/assets/js/currencyConverter.js', __FILE__), array( 'jquery-cookie' ), '1.2.3', true );

			}


		}

		$woocommerce_currency_converter = new WC_Currency_Converter();
	}
}
